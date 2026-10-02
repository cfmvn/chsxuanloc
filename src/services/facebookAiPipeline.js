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

/**
 * Tải ảnh từ URL Facebook về lưu cục bộ trong public/assets/posts/[slug]/
 * @param {string} url 
 * @param {string} destPath 
 */
export function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(true)));
    }).on('error', reject);
  });
}

/**
 * Xử lý tải toàn bộ ảnh từ bài đăng Facebook và lưu cục bộ
 * @param {string} slug 
 * @param {string[]} imageUrls 
 * @returns {Promise<string[]>} Danh sách đường dẫn ảnh local: ['/assets/posts/slug/anh-1.jpg', ...]
 */
export async function processPostMedia(slug, imageUrls = []) {
  if (!imageUrls || imageUrls.length === 0) {
    return ['/assets/images/default-post.jpg'];
  }

  const localUrls = [];
  for (let i = 0; i < imageUrls.length; i++) {
    const remoteUrl = imageUrls[i];
    const ext = path.extname(remoteUrl.split('?')[0]) || '.jpg';
    const filename = `anh-${i + 1}${ext}`;
    const destPath = path.join(process.cwd(), 'public', 'assets', 'posts', slug, filename);
    const publicUrl = `/assets/posts/${slug}/${filename}`;

    try {
      await downloadImage(remoteUrl, destPath);
      localUrls.push(publicUrl);
    } catch (err) {
      console.error(`⚠️ Không thể tải ảnh ${remoteUrl}:`, err.message);
    }
  }

  return localUrls.length > 0 ? localUrls : ['/assets/images/default-post.jpg'];
}

/**
 * Viết lại nội dung bài đăng từ Fanpage thành bài báo Markdown hoàn chỉnh có nhúng ảnh
 * @param {Object} rawPost { content, postedAt, mediaUrls: string[], link }
 */
export async function transformFacebookPostToArticle(rawPost) {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not defined in .env');
  }

  const mediaCount = (rawPost.mediaUrls || []).length;

  const prompt = `
Bạn là Trưởng ban Biên tập Cổng thông tin Cựu học sinh & Nhà trường Trường THPT Xuân Lộc (Đồng Nai).
Dưới đây là nội dung một bài đăng từ Fanpage Đoàn Trường THPT Xuân Lộc (https://www.facebook.com/vpdoan.thptxl):

--- NỘI DUNG GỐC ---
Thời gian đăng: ${rawPost.postedAt || new Date().toISOString()}
Số lượng ảnh đính kèm trong bài: ${mediaCount} ảnh
Nội dung bài viết:
"""
${rawPost.content}
"""
--- HẾT NỘI DUNG GỐC ---

NHIỆM VỤ CỦA BẠN:
1. Phân tích nội dung, trích xuất sự kiện, thời gian diễn ra sự kiện và ý nghĩa hoạt động.
2. Viết lại thành một bài báo hoàn chỉnh, văn phong trang trọng, chuẩn mực báo chí học đường.
3. Nếu bài viết có đính kèm ảnh (số lượng: ${mediaCount}), hãy chèn placeholder hình ảnh vào các vị trí thích hợp trong bài viết theo cú pháp:
   ![Chú thích ảnh 1]({{IMAGE_1}})
   ![Chú thích ảnh 2]({{IMAGE_2}}) (nếu có từ 2 ảnh trở lên)
4. Phân loại vào 1 trong các chuyên mục: 'Tin tức', 'Sự kiện', 'Họp khóa', 'Gương sáng', 'Tri ân', 'Bảng vàng', 'Lịch sử'.
5. Trả về kết quả dưới dạng JSON thuần túy (không bọc trong \`\`\`json) với cấu trúc:
{
  "title": "Tiêu đề bài báo ngắn gọn, đúng phong cách tin tức",
  "slug": "tieu-de-khong-dau-ngan-gon",
  "pubDate": "YYYY-MM-DD",
  "author": "Đoàn Trường THPT Xuân Lộc / Ban Truyền Thông CHS",
  "description": "Tóm tắt ngắn gọn 1-2 câu về nội dung bài viết",
  "category": "Tin tức / Sự kiện / Gương sáng ...",
  "tags": ["Tag1", "Tag2"],
  "markdownBody": "Nội dung bài viết hoàn chỉnh định dạng Markdown (có tiêu đề mục, đoạn văn, danh sách gạch đầu dòng, và các placeholder {{IMAGE_1}}, {{IMAGE_2}}...)"
}
`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: 'You are an expert Vietnamese journalist and school editor. You always output clean JSON without markdown codeblock wrappers.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const article = JSON.parse(resJson.choices[0].message.content);

  // Tải và xử lý ảnh nếu có
  let downloadedImages = [];
  if (rawPost.mediaUrls && rawPost.mediaUrls.length > 0) {
    downloadedImages = await processPostMedia(article.slug, rawPost.mediaUrls);
  }

  // Ảnh đại diện (Cover/Featured Image) lấy ảnh đầu tiên
  const featuredImage = downloadedImages[0] || rawPost.featuredImage || '/assets/images/default-post.jpg';

  // Thay thế placeholder {{IMAGE_1}}, {{IMAGE_2}} bằng link ảnh local thực tế
  let finalMarkdown = article.markdownBody;
  if (downloadedImages.length > 0) {
    downloadedImages.forEach((imgUrl, idx) => {
      finalMarkdown = finalMarkdown.replace(new RegExp(`\\{\\{IMAGE_${idx + 1}\\}\\}`, 'g'), imgUrl);
    });
  }
  // Xóa các placeholder thừa nếu có
  finalMarkdown = finalMarkdown.replace(/\{\{IMAGE_\d+\}\}/g, featuredImage);

  article.featuredImage = featuredImage;
  article.markdownBody = finalMarkdown;

  return article;
}

/**
 * Lưu bài báo thành file Markdown trong src/content/posts/
 */
export function saveArticleToMarkdown(article) {
  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const filePath = path.join(postsDir, `${article.slug}.md`);

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
  console.log(`✅ Đã xuất bản bài viết mới kèm ảnh: ${filePath}`);
  return filePath;
}
