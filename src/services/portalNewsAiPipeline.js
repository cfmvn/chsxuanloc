import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { downloadImage, processPostMedia } from './facebookAiPipeline.js';

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
 * Tải nội dung từ URL qua HTTP/HTTPS
 */
export function fetchHttp(url) {
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
        return fetchHttp(redirectUrl).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${cleanUrl} with status ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${cleanUrl}`));
    });
  });
}

/**
 * Giải mã HTML Entities
 */
export function decodeEntities(str = '') {
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x3A;/gi, ':')
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
}

/**
 * Tạo slug chuẩn tiếng Việt từ tiêu đề
 */
export function slugify(text = '') {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Chuyển đổi HTML bài báo thành Markdown chuẩn, bảo toàn toàn bộ nội dung và vị trí ảnh gốc
 */
export function convertHtmlToMarkdown(html = '', baseUrl = 'https://xuanloc.dongnai.gov.vn') {
  const images = [];

  // 1. Xử lý thẻ figure chứa ảnh và caption
  let md = html.replace(/<figure[^>]*>[\s\S]*?<img[^>]+src=["']([^"']+)["'][^>]*>[\s\S]*?(?:<figcaption[^>]*>([\s\S]*?)<\/figcaption>)?[\s\S]*?<\/figure>/gi, (match, src, caption) => {
    let cleanSrc = src.trim();
    if (cleanSrc.startsWith('//')) cleanSrc = 'https:' + cleanSrc;
    else if (cleanSrc.startsWith('/')) cleanSrc = baseUrl + cleanSrc;

    const cleanCaption = caption ? decodeEntities(caption.replace(/<[^>]+>/g, '').trim()) : '';
    const imgIndex = images.length + 1;
    images.push({ url: cleanSrc, caption: cleanCaption, index: imgIndex });
    return `\n\n![${cleanCaption || 'Ảnh bài viết'}]({{IMAGE_${imgIndex}}})\n\n`;
  });

  // 2. Xử lý các thẻ img đơn lẻ
  md = md.replace(/<img[^>]+src=["']([^"']+)["'](?:[^>]*alt=["']([^"']*)["'])?[^>]*>/gi, (match, src, alt) => {
    let cleanSrc = src.trim();
    if (cleanSrc.startsWith('//')) cleanSrc = 'https:' + cleanSrc;
    else if (cleanSrc.startsWith('/')) cleanSrc = baseUrl + cleanSrc;

    // Lọc bỏ icon, logo, banner hệ thống
    if (cleanSrc.includes('logo') || cleanSrc.includes('icon') || cleanSrc.includes('banner') || cleanSrc.includes('duongiaynong')) {
      return '';
    }

    const cleanAlt = alt ? decodeEntities(alt.trim()) : '';
    const imgIndex = images.length + 1;
    images.push({ url: cleanSrc, caption: cleanAlt, index: imgIndex });
    return `\n\n![${cleanAlt || 'Ảnh bài viết'}]({{IMAGE_${imgIndex}}})\n\n`;
  });

  // 3. Tiêu đề mục h1 - h6
  md = md.replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, (match, content) => {
    const text = decodeEntities(content.replace(/<[^>]+>/g, '').trim());
    return text ? `\n\n### ${text}\n\n` : '';
  });

  // 4. Đoạn in đậm dạng tiêu đề mục nhỏ
  md = md.replace(/<p[^>]*>\s*<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>\s*<\/p>/gi, (match, content) => {
    const text = decodeEntities(content.replace(/<[^>]+>/g, '').trim());
    if (text.length > 0 && text.length < 120 && !text.endsWith('.')) {
      return `\n\n### ${text}\n\n`;
    }
    return text ? `\n\n**${text}**\n\n` : '';
  });

  // 5. In đậm inline
  md = md.replace(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, (match, content) => {
    const text = decodeEntities(content.replace(/<[^>]+>/g, '').trim());
    return text ? ` **${text}** ` : '';
  });

  // 6. In nghiêng inline
  md = md.replace(/<(?:em|i)[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, (match, content) => {
    const text = decodeEntities(content.replace(/<[^>]+>/g, '').trim());
    return text ? ` *${text}* ` : '';
  });

  // 7. Đoạn văn p
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (match, content) => {
    const text = decodeEntities(content.replace(/<[^>]+>/g, '').trim());
    return text ? `\n\n${text}\n\n` : '';
  });

  // 8. Thẻ div hoặc blockquote
  md = md.replace(/<(?:div|blockquote)[^>]*>([\s\S]*?)<\/(?:div|blockquote)>/gi, (match, content) => {
    const text = decodeEntities(content.replace(/<[^>]+>/g, '').trim());
    return text ? `\n\n${text}\n\n` : '';
  });

  // 9. Xóa toàn bộ thẻ HTML còn lại
  md = md.replace(/<[^>]+>/g, '');
  md = decodeEntities(md);

  // 10. Định dạng khoảng cách dòng gọn gàng
  md = md.replace(/\n\s*\n\s*\n+/g, '\n\n').trim();

  return { markdown: md, images };
}

/**
 * Cào danh sách tin từ RSS Cổng Thông Tin Xuân Lộc (Văn Hóa - Xã Hội)
 */
export async function fetchPortalNewsFeed() {
  const rssUrl = 'https://xuanloc.dongnai.gov.vn/vi/news/rss/van-hoa-xa-hoi/';
  console.log(`🌐 Đang quét RSS từ Cổng TTĐT Xuân Lộc: ${rssUrl}`);
  
  const xmlData = await fetchHttp(rssUrl);
  const items = [];
  const itemMatches = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const itemXml of itemMatches) {
    const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemXml.match(/<title>(.*?)<\/title>/);
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
    const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
    const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);
    const guidMatch = itemXml.match(/<guid[^>]*>([\s\S]*?)<\/guid>/);

    let title = titleMatch ? decodeEntities(titleMatch[1].trim()) : '';
    const link = linkMatch ? linkMatch[1].trim() : '';
    let pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';
    const descRaw = descMatch ? descMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : '';
    const guid = guidMatch ? guidMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : '';

    // Trích xuất ngày từ tiêu đề nếu có định dạng (DD/MM/YYYY)
    const titleDateMatch = title.match(/\((\d{1,2})\/(\d{1,2})\/(\d{4})\)$/);
    if (titleDateMatch) {
      pubDate = `${titleDateMatch[3]}-${titleDateMatch[2].padStart(2, '0')}-${titleDateMatch[1].padStart(2, '0')}`;
      // Loại bỏ đuôi ngày khỏi tiêu đề để tránh trùng lặp slug
      title = title.replace(/\s*\(\d{1,2}\/\d{1,2}\/\d{4}\)$/, '').trim();
    }

    const imgMatch = descRaw.match(/<img[^>]+src=["']([^"']+)["']/i);
    let imageUrl = imgMatch ? imgMatch[1].trim() : '';
    if (imageUrl.startsWith('//')) imageUrl = 'https:' + imageUrl;
    else if (imageUrl.startsWith('/')) imageUrl = 'https://xuanloc.dongnai.gov.vn' + imageUrl;

    const textContent = decodeEntities(descRaw.replace(/<[^>]+>/g, '').trim());

    if (title && link) {
      items.push({
        guid,
        title,
        link,
        pubDate,
        imageUrl,
        textContent
      });
    }
  }

  return items;
}

/**
 * Lấy chi tiết toàn văn bài báo từ link bài viết trên Cổng TTĐT
 */
export async function fetchPortalArticleDetail(articleUrl) {
  try {
    const html = await fetchHttp(articleUrl);
    
    // 1. Trích xuất phần tóm tắt đầu bài (hometext / sapo) nếu có
    let sapoHtml = '';
    const homeMatch = html.match(/<div[^>]+id=["']news-hometext["'][^>]*>([\s\S]*?)<\/div>/i) ||
                      html.match(/<div[^>]+class=["'][^"']*hometext[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
    if (homeMatch) {
      sapoHtml = homeMatch[1].trim();
    }

    // 2. Tìm khung chứa toàn bộ bài viết (bodyhtml)
    const bodyMatch = html.match(/<div id="news-bodyhtml"[\s\S]*?>([\s\S]*?)<\/div>\s*<\/div>/i) ||
                      html.match(/<div id="news-bodyhtml"[\s\S]*?>([\s\S]*?)<\/div>/i) ||
                      html.match(/<div class="hnewsdetail"[\s\S]*?>([\s\S]*?)<\/div>/i) ||
                      html.match(/<div class="bodytext"[\s\S]*?>([\s\S]*?)<\/div>/i);

    if (!bodyMatch && !sapoHtml) {
      return { fullMarkdown: '', rawImages: [] };
    }

    // Ghép sapo và bodyHtml lại để không bỏ sót đoạn mở đầu bài báo
    let combinedHtml = '';
    if (sapoHtml) {
      combinedHtml += `<p class="sapo"><strong>${sapoHtml}</strong></p>\n`;
    }
    if (bodyMatch) {
      combinedHtml += bodyMatch[1];
    }

    const { markdown, images } = convertHtmlToMarkdown(combinedHtml);

    // 3. Trích xuất ngày đăng chính xác từ meta tag, itemprop hoặc regex ngày tháng
    let pubDate = '';
    const metaDateMatch = html.match(/<meta[^>]+name=["']DC\.Date["'][^>]+content=["'](\d{4})-(\d{2})-(\d{2})/i) ||
                          html.match(/itemprop=["']datePublished["']>(\d{4})-(\d{2})-(\d{2})/i) ||
                          html.match(/property=["']article:published_time["'][^>]+content=["'](\d{4})-(\d{2})-(\d{2})/i);
    
    if (metaDateMatch) {
      pubDate = `${metaDateMatch[1]}-${metaDateMatch[2]}-${metaDateMatch[3]}`;
    } else {
      const clockMatch = html.match(/<em class=["']fa fa-clock-o["']>\s*&nbsp;\s*<\/em>\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/i) ||
                         html.match(/(\d{1,2})\/(\d{1,2})\/(202[4-6])/);
      if (clockMatch) {
        pubDate = `${clockMatch[3]}-${clockMatch[2].padStart(2, '0')}-${clockMatch[1].padStart(2, '0')}`;
      }
    }

    return {
      fullMarkdown: markdown,
      rawImages: images,
      pubDate
    };
  } catch (e) {
    console.warn(`⚠️ Không thể lấy chi tiết bài viết ${articleUrl}:`, e.message);
    return { fullMarkdown: '', rawImages: [], pubDate: '' };
  }
}

/**
 * Phân loại bài viết bằng AI (hoặc fallback thông minh)
 */
async function classifyArticleMetadata(title, summary, dateStr) {
  // Format pubDate: YYYY-MM-DD
  let pubDate = new Date().toISOString().split('T')[0];
  if (dateStr) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      pubDate = dateStr;
    } else {
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        pubDate = parsedDate.toISOString().split('T')[0];
      }
    }
  }

  // Fallback metadata mặc định
  let category = 'Tin tức';
  let description = summary ? summary.substring(0, 180).trim() + '...' : title;
  let tags = ['Xuân Lộc', 'Văn hóa xã hội'];

  // Quy tắc từ khóa cơ bản
  const lower = (title + ' ' + summary).toLowerCase();
  if (lower.includes('học bổng') || lower.includes('khuyến học') || lower.includes('san sẻ yêu thương') || lower.includes('trao quà')) {
    category = 'Học bổng';
    tags.push('Khuyến học');
  } else if (lower.includes('cựu học sinh') || lower.includes('họp mặt') || lower.includes('khoá')) {
    category = 'Cựu học sinh';
    tags.push('Cựu học sinh');
  } else if (lower.includes('học sinh giỏi') || lower.includes('học sinh 3 tốt') || lower.includes('nghệ nhân') || lower.includes('thầy giáo') || lower.includes('gương')) {
    category = 'Gương sáng';
    tags.push('Gương sáng');
  } else if (lower.includes('di tích') || lower.includes('núi chứa chan') || lower.includes('đền thờ liệt sĩ') || lower.includes('lịch sử') || lower.includes('truyền thống')) {
    category = 'Lịch sử';
    tags.push('Di tích lịch sử');
  } else if (lower.includes('hội thao') || lower.includes('đêm hội') || lower.includes('khai giảng') || lower.includes('lễ') || lower.includes('trung thu')) {
    category = 'Sự kiện';
    tags.push('Sự kiện');
  }

  // Nếu có Groq API key -> Sử dụng AI để tinh chỉnh metadata tốt nhất
  if (GROQ_API_KEY) {
    try {
      const prompt = `
Dưới đây là một bài báo từ Cổng thông tin điện tử Xuân Lộc:
Tiêu đề: "${title}"
Nội dung tóm tắt: "${summary.substring(0, 600)}"

Nhiệm vụ:
1. Xác định chuyên mục phù hợp nhất trong các chuyên mục:
   'Tin tức' / 'Sự kiện' / 'Gương sáng' / 'Học bổng' / 'Cựu học sinh' / 'Lịch sử' / 'Tri ân' / 'Bảng vàng'.
2. Viết 1-2 câu tóm tắt trang trọng (description).
3. Tạo 2-4 tags phù hợp (ví dụ: ["Xuân Lộc", "Khuyến học"]).

Trả về JSON thuần túy (không thừa ký tự):
{
  "category": "Gương sáng",
  "description": "Tóm tắt ngắn gọn 1-2 câu",
  "tags": ["Xuân Lộc", "Khuyến học"]
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
            { role: 'system', content: 'You are a professional editor. Output valid JSON only.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 500
        })
      });

      if (response.ok) {
        const resJson = await response.json();
        const rawContent = resJson.choices[0].message.content.trim();
        const cleanJson = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
        const parsed = JSON.parse(cleanJson);
        if (parsed.category) category = parsed.category;
        if (parsed.description) description = parsed.description;
        if (Array.isArray(parsed.tags) && parsed.tags.length > 0) tags = parsed.tags;
      }
    } catch (aiErr) {
      // Giữ nguyên fallback nếu AI gặp sự cố
    }
  }

  return { category, description, tags, pubDate };
}

/**
 * Biên tập & chuẩn bị toàn bộ dữ liệu bài báo từ Cổng TTĐT
 */
export async function transformPortalPostToArticle(portalItem, detailData) {
  let slug = slugify(portalItem.title);
  if (!slug) slug = `tin-tuc-${Date.now()}`;

  const bodyMarkdown = (detailData.fullMarkdown && detailData.fullMarkdown.length > 100)
    ? detailData.fullMarkdown
    : portalItem.textContent;

  const itemDate = detailData.pubDate || portalItem.pubDate;
  const metadata = await classifyArticleMetadata(portalItem.title, portalItem.textContent, itemDate);

  // Thu thập toàn bộ danh sách URL ảnh từ chi tiết bài viết
  const allImageUrls = [];
  if (detailData.rawImages && detailData.rawImages.length > 0) {
    detailData.rawImages.forEach(img => {
      if (img.url && !allImageUrls.includes(img.url)) {
        allImageUrls.push(img.url);
      }
    });
  }
  // Nếu bài viết không có ảnh trong body, bổ sung ảnh từ RSS
  if (allImageUrls.length === 0 && portalItem.imageUrl) {
    allImageUrls.push(portalItem.imageUrl);
  }

  // Tải TOÀN BỘ ảnh gốc độ phân giải cao về thư mục public/assets/posts/[slug]/
  let downloadedUrls = [];
  if (allImageUrls.length > 0) {
    downloadedUrls = await processPostMedia(slug, allImageUrls);
  }

  const featuredImage = downloadedUrls[0] || '/assets/images/default-post.jpg';

  // Thay thế placeholder {{IMAGE_N}} trong Markdown bằng đường dẫn ảnh cục bộ
  let finalMarkdown = bodyMarkdown;
  if (downloadedUrls.length > 0) {
    downloadedUrls.forEach((imgUrl, idx) => {
      finalMarkdown = finalMarkdown.replace(new RegExp(`\\{\\{IMAGE_${idx + 1}\\}\\}`, 'g'), imgUrl);
    });
  }
  // Dọn dẹp các placeholder ảnh dư thừa nếu có
  finalMarkdown = finalMarkdown.replace(/\{\{IMAGE_\d+\}\}/g, featuredImage);

  // Bổ sung nguồn gốc bài viết ở chân trang
  if (!finalMarkdown.includes('Nguồn: Cổng thông tin điện tử')) {
    finalMarkdown += `\n\n---\n*Nguồn: Cổng thông tin điện tử phường Xuân Lộc ([${portalItem.link}](${portalItem.link}))*`;
  }

  return {
    shouldPublish: true,
    title: portalItem.title,
    slug,
    pubDate: metadata.pubDate,
    author: 'Cổng TTĐT Xuân Lộc (Tổng hợp)',
    description: metadata.description,
    category: metadata.category,
    featuredImage,
    tags: metadata.tags,
    markdownBody: finalMarkdown
  };
}

/**
 * Lưu bài báo thành file Markdown trong src/content/posts/
 * Kiểm tra chống ghi đè dữ liệu cũ
 */
export function saveArticleToMarkdown(article, options = { overwrite: false }) {
  if (!article || article.shouldPublish === false) return null;

  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const filePath = path.join(postsDir, `${article.slug}.md`);

  // Bảo vệ bài viết đã tồn tại: không ghi đè nếu options.overwrite = false
  if (fs.existsSync(filePath) && !options.overwrite) {
    console.log(`⏩ [ĐÃ TỒN TẠI] Giữ nguyên bài viết hiện có, không ghi đè: ${article.slug}.md`);
    return filePath;
  }

  const fileContent = `---
title: ${JSON.stringify(article.title)}
pubDate: ${article.pubDate}
author: ${JSON.stringify(article.author || 'Cổng TTĐT Xuân Lộc (Tổng hợp)')}
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

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

/**
 * Hàm thực thi đồng bộ tin tức mới từ Cổng TTĐT Xuân Lộc
 * @param {number} maxItems Giới hạn số bài quét (mặc định: 15)
 * @param {Object} options { overwrite: false }
 */
export async function syncPortalNews(maxItems = 15, options = { overwrite: false }) {
  console.log('\n======================================================');
  console.log('🏛️ BẮT ĐẦU ĐỒNG BỘ TIN TỨC TỪ CỔNG TTĐT XUÂN LỘC (VĂN HÓA - XÃ HỘI)');
  console.log('======================================================\n');

  try {
    const feedItems = await fetchPortalNewsFeed();
    const itemsToProcess = feedItems.slice(0, maxItems);
    console.log(`📋 Đã tìm thấy ${feedItems.length} tin trên RSS. Đang quét ${itemsToProcess.length} tin mới nhất...\n`);

    const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
    let newCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < itemsToProcess.length; i++) {
      const item = itemsToProcess[i];
      const testSlug = slugify(item.title);
      const testFilePath = path.join(postsDir, `${testSlug}.md`);

      // Kiểm tra nhanh xem bài viết đã tồn tại trên đĩa chưa
      if (fs.existsSync(testFilePath) && !options.overwrite) {
        console.log(`⏩ [${i + 1}/${itemsToProcess.length}] [ĐÃ CÓ TRÊN HỆ THỐNG] Bỏ qua: "${item.title}"`);
        skippedCount++;
        continue;
      }

      console.log(`\n📥 [${i + 1}/${itemsToProcess.length}] Đang tải chi tiết toàn văn & ảnh gốc: "${item.title}"`);
      
      try {
        const detail = await fetchPortalArticleDetail(item.link);
        const article = await transformPortalPostToArticle(item, detail);

        if (article.shouldPublish) {
          const savedPath = saveArticleToMarkdown(article, options);
          console.log(`✨ Đã lưu bài báo thành công: ${savedPath}`);
          newCount++;
        }
      } catch (postErr) {
        console.warn(`⚠️ Bỏ qua bài viết "${item.title}" do lỗi:`, postErr.message);
      }

      // Nghỉ 1s giữa các request để đảm bảo an toàn băng thông
      if (i < itemsToProcess.length - 1) {
        await sleep(1000);
      }
    }

    console.log(`\n🎉 TỔNG KẾT ĐỒNG BỘ CỔNG TTĐT:`);
    console.log(`- Bài viết mới xuất bản: ${newCount}`);
    console.log(`- Bài viết cũ đã có (giữ nguyên): ${skippedCount}`);
    console.log(`======================================================\n`);
  } catch (err) {
    console.error('❌ Lỗi trong quá trình đồng bộ Cổng TTĐT:', err);
  }
}
