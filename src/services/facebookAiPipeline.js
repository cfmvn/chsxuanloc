import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

function getGroqKey() {
  if (process.env.GROQ_API_KEY) return process.env.GROQ_API_KEY;
  try {
    const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
    const match = envContent.match(/GROQ_API_KEY=([^\r\n]+)/);
    return match ? match[1].trim() : '';
  } catch (e) {
    return '';
  }
}

const GROQ_API_KEY = getGroqKey();

import sharp from 'sharp';
import { uploadBufferToR2, getR2Client } from './r2Storage.js';

/**
 * Tải ảnh từ URL, nén WebP và trả về Buffer
 */
export function fetchAndOptimizeImageBuffer(url) {
  return new Promise((resolve, reject) => {
    let cleanUrl = url.trim();
    if (cleanUrl.startsWith('//')) cleanUrl = 'https:' + cleanUrl;

    const mod = cleanUrl.startsWith('https') ? https : http;
    const req = mod.get(cleanUrl, { 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 20000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('//')) redirectUrl = 'https:' + redirectUrl;
        return fetchAndOptimizeImageBuffer(redirectUrl).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode} for ${cleanUrl}`));
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', async () => {
        try {
          const rawBuffer = Buffer.concat(chunks);
          const webpBuffer = await sharp(rawBuffer)
            .rotate()
            .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80, effort: 4 })
            .toBuffer();
          resolve(webpBuffer);
        } catch (err) {
          resolve(Buffer.concat(chunks));
        }
      });
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout downloading ${cleanUrl}`));
    });
  });
}

/**
 * Tải ảnh từ URL, nén và chuyển đổi sang WebP lưu cục bộ (fallback khi không có R2)
 */
export async function downloadImage(url, destPath) {
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const buffer = await fetchAndOptimizeImageBuffer(url);
  fs.writeFileSync(destPath, buffer);
  return true;
}

/**
 * Xử lý tải toàn bộ ảnh từ bài đăng, tự động nén và upload lên Cloudflare R2 CDN
 */
export async function processPostMedia(slug, imageUrls = []) {
  if (!imageUrls || imageUrls.length === 0) {
    return ['/assets/images/default-post.jpg'];
  }

  const isR2Enabled = !!getR2Client();
  const mediaUrls = [];

  for (let i = 0; i < imageUrls.length; i++) {
    const rawUrl = imageUrls[i];
    if (!rawUrl) continue;

    const filename = `anh-${i + 1}.webp`;
    const r2Key = `posts/${slug}/${filename}`;
    const localDestPath = path.join(process.cwd(), 'public', 'assets', 'posts', slug, filename);
    const localPublicUrl = `/assets/posts/${slug}/${filename}`;

    try {
      const optimizedBuffer = await fetchAndOptimizeImageBuffer(rawUrl);

      if (isR2Enabled) {
        const cdnUrl = await uploadBufferToR2(optimizedBuffer, r2Key, 'image/webp');
        mediaUrls.push(cdnUrl);
        console.log(`☁️ Đã upload ảnh lên Cloudflare R2: ${cdnUrl}`);
      } else {
        const dir = path.dirname(localDestPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(localDestPath, optimizedBuffer);
        mediaUrls.push(localPublicUrl);
      }
    } catch (err) {
      console.error(`⚠️ Không thể xử lý ảnh ${rawUrl}:`, err.message);
    }
  }

  return mediaUrls.length > 0 ? mediaUrls : ['/assets/images/default-post.jpg'];
}

/**
 * AI Phân loại & Viết lại nội dung bài đăng từ Fanpage
 * Tự động lọc các bài spam / cá nhân / không phù hợp
 * @param {Object} rawPost { content, postedAt, mediaUrls: string[], link }
 */
export async function transformFacebookPostToArticle(rawPost) {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not defined in .env');
  }

  const mediaCount = (rawPost.mediaUrls || []).length;

  const prompt = `
Bạn là Trưởng ban Biên tập Cổng thông tin Cựu học sinh & Nhà trường Trường THPT Xuân Lộc (Đồng Nai).
Dưới đây là một bài đăng từ Fanpage Đoàn Trường THPT Xuân Lộc (https://www.facebook.com/vpdoan.thptxl):

--- NỘI DUNG GỐC ---
Thời gian đăng: ${rawPost.postedAt || new Date().toISOString()}
Số lượng ảnh đính kèm: ${mediaCount} ảnh
Nội dung bài viết:
"""
${rawPost.content}
"""
--- HẾT NỘI DUNG GỐC ---

NHIỆM VỤ CỦA BẠN:
1. BỘ LỌC CHẤT LƯỢNG TIN TỨC & BÀI BÁO (CỰC KỲ QUAN TRỌNG):
   Hãy đánh giá khắt khe xem bài viết có đủ chiều sâu thông tin để trở thành một "BÀI BÁO / BÀI VIẾT CHÍNH THỨC" trên website hay không:

   ❌ ĐẶT "shouldPublish": false và nêu rõ "rejectReason" nếu thuộc các trường hợp sau:
   - Thông báo ngắn nội bộ, nhắc nhở giờ giấc, hẹn giờ tập trung ngắn dưới vài câu (Ví dụ: "Chiều nay 14h các bạn tập trung sân cờ", "Nhớ mang theo áo đoàn nhé các bạn"...).
   - Bài đăng "thả thính", bài đếm ngược (countdown / teaser) chỉ có vài câu khích lệ tinh thần mà không có diễn biến sự kiện cụ thể.
   - Bài chào hỏi, status cá nhân, tâm trạng vu vơ, chúc ngày mới.
   - Bài viết quá ngắn (dưới 40 từ) hoặc chỉ gồm emoji, hashtag mà không mang giá trị tin tức tư liệu cho nhà trường / cựu học sinh.

   ✅ ĐẶT "shouldPublish": true KHI VÀ CHỈ KHI:
   - Bài viết có đầy đủ thông tin sự kiện, chương trình (Chủ đề, diễn biến, ý nghĩa, hoạt động cụ thể, giải thưởng, danh sách tuyên dương, thông điệp...).
   - Các hoạt động chuyên môn, phong trào thi đua, học bổng, sự kiện khai giảng/bế giảng, thành tích học sinh giỏi, văn nghệ - thể thao, hoạt động kết nối cựu học sinh, tri ân thầy cô.

2. PHÂN LOẠI CHUYÊN MỤC CHÍNH XÁC:
   Chọn đúng 1 trong các chuyên mục sau:
   - 'Tin tức': Các thông báo chính thức, tin tức giáo dục, thời sự nhà trường.
   - 'Sự kiện': Khai giảng, bế giảng, lễ 20/11, hội trại, hội khỏe phù đổng, chào cờ chủ điểm.
   - 'Cựu học sinh': Các hoạt động của cựu học sinh, họp mặt, tài trợ học bổng, kết nối việc làm.
   - 'Gương sáng': Tuyên dương học sinh 3 tốt, học sinh giỏi quốc gia/tỉnh, thầy cô tiêu biểu.
   - 'Học bổng': Chương trình San sẻ yêu thương, trao tặng quà, quỹ khuyến học.
   - 'Tri ân': Thư tri ân, kỷ niệm thầy trò, các hoạt động tri ân thầy cô hưu trí.
   - 'Bảng vàng': Thành tích các kỳ thi tốt nghiệp, đại học, thể thao, văn nghệ.
   - 'Văn hoá': Kỷ niệm thành lập trường, di tích lịch sử, danh lam thắng cảnh, văn hoá truyền thống địa phương.

3. BIÊN TẬP BÀI BÁO HOÀN CHỈNH (Văn phong báo chí, trang trọng, mạch lạc):
   - Giữ gìn đầy đủ chi tiết, thông tin sự kiện, tên tuổi, số liệu thực tế.
   - Trích xuất ngày giờ thực tế của sự kiện (nếu có) để đặt "pubDate" (YYYY-MM-DD).
   - Nếu bài có ảnh (${mediaCount} ảnh), hãy chèn placeholder vào các đoạn văn phù hợp:
     ![Chú thích ảnh 1]({{IMAGE_1}})
     ![Chú thích ảnh 2]({{IMAGE_2}})

4. TRẢ VỀ JSON THUẦN TÚY (không bọc trong markdown block):
{
  "shouldPublish": true / false,
  "rejectReason": "Giải thích lý do nếu từ chối (vd: Thông báo ngắn nội bộ / Bài đếm ngược ngắn không có nội dung sự kiện)",
  "title": "Tiêu đề bài báo hấp dẫn, trang trọng",
  "slug": "tieu-de-khong-dau-ngan-gon",
  "pubDate": "YYYY-MM-DD",
  "author": "Đoàn Trường THPT Xuân Lộc",
  "description": "Tóm tắt ngắn gọn 1-2 câu",
  "category": "Sự kiện / Tin tức / Gương sáng / Cựu học sinh / Học bổng / Tri ân / Bảng vàng / Văn hoá",
  "tags": ["Tag1", "Tag2"],
  "markdownBody": "Toàn bộ bài viết định dạng Markdown hoàn chỉnh"
}
`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: 'You are an expert Vietnamese journalist and school editor. You always output valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 2500
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const rawContent = resJson.choices[0].message.content.trim();
  const cleanJson = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
  const article = JSON.parse(cleanJson);

  // Nếu bài viết bị bộ lọc từ chối
  if (article.shouldPublish === false) {
    return article;
  }

  // Tải và xử lý ảnh nếu có
  let downloadedImages = [];
  if (rawPost.mediaUrls && rawPost.mediaUrls.length > 0) {
    downloadedImages = await processPostMedia(article.slug, rawPost.mediaUrls);
  }

  let finalMarkdown = article.markdownBody || '';

  // 1. Sửa lỗi AI trả về literal '\n' thay vì xuống dòng thực tế
  if (finalMarkdown.includes('\\n')) {
    finalMarkdown = finalMarkdown.replace(/\\n/g, '\n');
  }

  // 2. Chèn link ảnh thực tế từ R2 CDN vào placeholder
  if (downloadedImages.length > 0) {
    downloadedImages.forEach((imgUrl, idx) => {
      finalMarkdown = finalMarkdown.replace(new RegExp(`\\{\\{IMAGE_${idx + 1}\\}\\}`, 'g'), imgUrl);
    });
  }
  finalMarkdown = finalMarkdown.replace(/\{\{IMAGE_\d+\}\}/g, featuredImage);

  // 3. Tự động bổ sung thông tin nguồn bài viết từ Fanpage Đoàn Trường
  const fbLink = rawPost.link || 'https://www.facebook.com/vpdoan.thptxl';
  if (!finalMarkdown.includes('Nguồn: Đoàn Trường THPT Xuân Lộc') && !finalMarkdown.includes('Nguồn: Fanpage')) {
    finalMarkdown += `\n\n---\n*Nguồn: Ban Chấp hành Đoàn Trường THPT Xuân Lộc ([Bài viết gốc trên Facebook](${fbLink}))*`;
  }

  article.featuredImage = featuredImage;
  article.markdownBody = finalMarkdown.trim();

  return article;
}

/**
 * Lưu bài báo thành file Markdown trong src/content/posts/
 * Mặc định KHÔNG ghi đè bài viết cũ để bảo toàn dữ liệu
 */
export function saveArticleToMarkdown(article, options = { overwrite: false }) {
  if (!article || article.shouldPublish === false) {
    if (article && article.rejectReason) {
      console.log(`⚠️ Bỏ qua không xuất bản: ${article.rejectReason}`);
    }
    return null;
  }

  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const filePath = path.join(postsDir, `${article.slug}.md`);

  // Kiểm tra chống ghi đè bài viết đã tồn tại
  if (fs.existsSync(filePath) && !options.overwrite) {
    console.log(`⏩ [ĐÃ TỒN TẠI] Giữ nguyên bài viết hiện có, không ghi đè: ${article.slug}.md`);
    return filePath;
  }

  const fileContent = `---
title: ${JSON.stringify(article.title)}
pubDate: ${article.pubDate}
author: ${JSON.stringify(article.author || 'Đoàn Trường THPT Xuân Lộc')}
description: ${JSON.stringify(article.description)}
category: ${JSON.stringify(article.category || 'Tin tức')}
featuredImage: ${JSON.stringify(article.featuredImage || '/assets/images/default-post.jpg')}
featured: false
tags: ${JSON.stringify(article.tags || [])}
---

${article.markdownBody}
`;

  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`✅ [ĐÃ XUẤT BẢN - Chuyên mục: ${article.category}] ${filePath}`);
  return filePath;
}
