import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { downloadImage, processPostMedia, saveArticleToMarkdown } from './facebookAiPipeline.js';


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
 * Tải nội dung text từ URL
 */
function fetchHttp(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchHttp(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url} with status ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * Cào danh sách tin từ RSS Cổng Thông Tin Xuân Lộc (Văn Hóa - Xã Hội)
 */
export async function fetchPortalNewsFeed() {
  const rssUrl = 'https://xuanloc.dongnai.gov.vn/vi/news/rss/van-hoa-xa-hoi/';
  console.log(`🌐 Đang quét RSS từ Cổng TTĐT Xuân Lộc: ${rssUrl}`);
  
  const xmlData = await fetchHttp(rssUrl);
  
  // Trích xuất các item bằng regex hoặc xml parser đơn giản
  const items = [];
  const itemMatches = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const itemXml of itemMatches) {
    const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemXml.match(/<title>(.*?)<\/title>/);
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
    const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
    const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);
    const guidMatch = itemXml.match(/<guid[^>]*>([\s\S]*?)<\/guid>/);

    const title = titleMatch ? titleMatch[1].replace(/&#x3A;/g, ':').trim() : '';
    const link = linkMatch ? linkMatch[1].trim() : '';
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';
    const descRaw = descMatch ? descMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : '';
    const guid = guidMatch ? guidMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : '';

    // Tìm ảnh trong thẻ description
    const imgMatch = descRaw.match(/<img[^>]+src=["']([^"']+)["']/i);
    const imageUrl = imgMatch ? imgMatch[1] : '';
    const textContent = descRaw.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();

    items.push({
      guid,
      title,
      link,
      pubDate,
      imageUrl,
      textContent
    });
  }

  return items;
}

/**
 * Lấy chi tiết toàn văn bài báo từ link bài viết trên Cổng TTĐT
 */
export async function fetchPortalArticleDetail(articleUrl) {
  try {
    const html = await fetchHttp(articleUrl);
    
    // Trích xuất ảnh chính và các đoạn văn trong bài
    const imageMatches = [...html.matchAll(/<img[^>]+src=["'](\/uploads\/[^"']+|\/assets\/xuanloc\/news\/[^"']+|https?:\/\/[^"']+\.(?:jpg|png|jpeg))["']/gi)];
    const mediaUrls = imageMatches.map(m => {
      let src = m[1];
      if (src.startsWith('/')) {
        src = 'https://xuanloc.dongnai.gov.vn' + src;
      }
      return src;
    }).filter(url => !url.includes('logo') && !url.includes('icon') && !url.includes('bghead'));

    // Lấy nội dung text trong thẻ hnewsdetail / content / detail-content
    let bodyText = '';
    const bodyMatch = html.match(/<div class="hnewsdetail"[\s\S]*?>([\s\S]*?)<\/div>/i) ||
                      html.match(/<div id="news-bodyhtml"[\s\S]*?>([\s\S]*?)<\/div>/i) ||
                      html.match(/<div class="bodytext"[\s\S]*?>([\s\S]*?)<\/div>/i);

    if (bodyMatch) {
      bodyText = bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, '')
                             .replace(/<style[\s\S]*?<\/style>/gi, '')
                             .replace(/<[^>]+>/g, ' ')
                             .replace(/\s+/g, ' ')
                             .trim();
    }

    return {
      fullContent: bodyText,
      mediaUrls: Array.from(new Set(mediaUrls))
    };
  } catch (e) {
    console.warn(`⚠️ Không thể lấy chi tiết bài viết ${articleUrl}:`, e.message);
    return { fullContent: '', mediaUrls: [] };
  }
}

/**
 * AI Biên tập & Phân loại tin tức Văn Hóa - Xã Hội Xuân Lộc
 */
export async function transformPortalPostToArticle(portalItem, detailData) {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not defined');
  }

  const combinedContent = (detailData.fullContent && detailData.fullContent.length > 100) 
    ? detailData.fullContent 
    : portalItem.textContent;

  const trimmedContent = combinedContent.length > 1500 ? combinedContent.substring(0, 1500) + '...' : combinedContent;


  const prompt = `
Bạn là Trưởng ban Biên tập Cổng thông tin Cựu học sinh & Nhà trường THPT Xuân Lộc.
Hãy viết lại bài báo sau từ Cổng TTĐT Xuân Lộc (Chuyên mục Văn hóa - Xã hội):

Tiêu đề: ${portalItem.title}
Link: ${portalItem.link}
Ngày: ${portalItem.pubDate}
Nội dung tóm tắt:
"""
${trimmedContent}
"""

YÊU CẦU:
1. Đánh giá xuất bản: "shouldPublish": true (tin văn hóa, giáo dục, sự kiện, người tốt việc tốt, di tích Núi Chứa Chan, Đền thờ Liệt sĩ tại Xuân Lộc).
2. Chuyên mục: 'Tin tức' / 'Sự kiện' / 'Lịch sử' / 'Gương sáng' / 'Học bổng'.
3. Viết lại bài báo súc tích (3-4 đoạn), trang trọng, gắn kết tình cảm với quê hương Xuân Lộc. Cuối bài ghi: "*Nguồn: Cổng thông tin điện tử phường Xuân Lộc (${portalItem.link})*".
4. TRẢ VỀ JSON HỢP LỆ (chỉ JSON, không thừa bất kỳ ký tự nào):
{
  "shouldPublish": true,
  "rejectReason": "",
  "title": "Tiêu đề bài báo báo chí",
  "slug": "tieu-de-khong-dau-ngan-gon",
  "pubDate": "YYYY-MM-DD",
  "author": "Cổng TTĐT Xuân Lộc (Tổng hợp)",
  "description": "Tóm tắt 1-2 câu",
  "category": "Tin tức / Sự kiện / Lịch sử / Gương sáng / Học bổng",
  "tags": ["Xuân Lộc", "Văn hóa xã hội"],
  "markdownBody": "Toàn văn bài viết markdown"
}
`;

  // Gọi Groq API với cơ chế retry nếu gặp rate limit
  let attempts = 0;
  let resJson = null;

  while (attempts < 3) {
    try {
      attempts++;
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [
            { role: 'system', content: 'You are a professional Vietnamese journalist. Output valid JSON only.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 2000
        })
      });

      if (response.status === 429) {
        console.warn(`⏳ Rate limit hit, đang chờ 15s trước khi thử lại (lần ${attempts}/3)...`);
        await sleep(15000);
        continue;
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API Error (${response.status}): ${errText}`);
      }

      resJson = await response.json();
      break;
    } catch (e) {
      if (attempts >= 3) throw e;
      await sleep(5000);
    }
  }

  const rawContent = resJson.choices[0].message.content.trim();
  const cleanJson = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
  const article = JSON.parse(cleanJson);


  if (article.shouldPublish === false) {
    return article;
  }

  // Tải ảnh đại diện và ảnh bài viết
  const allImages = [];
  if (portalItem.imageUrl) allImages.push(portalItem.imageUrl);
  if (detailData.mediaUrls && detailData.mediaUrls.length > 0) {
    detailData.mediaUrls.forEach(u => {
      if (!allImages.includes(u)) allImages.push(u);
    });
  }

  let downloadedImages = [];
  if (allImages.length > 0) {
    downloadedImages = await processPostMedia(article.slug, allImages.slice(0, 3));
  }

  const featuredImage = downloadedImages[0] || '/assets/images/default-post.jpg';
  let finalMarkdown = article.markdownBody || '';
  if (downloadedImages.length > 0) {
    downloadedImages.forEach((imgUrl, idx) => {
      finalMarkdown = finalMarkdown.replace(new RegExp(`\\{\\{IMAGE_${idx + 1}\\}\\}`, 'g'), imgUrl);
    });
  }
  finalMarkdown = finalMarkdown.replace(/\{\{IMAGE_\d+\}\}/g, featuredImage);

  article.featuredImage = featuredImage;
  article.markdownBody = finalMarkdown;

  return article;
}

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

/**
 * Hàm thực thi đồng bộ toàn bộ tin tức mới từ Cổng TTĐT Xuân Lộc
 * @param {number} maxItems Giới hạn số bài xử lý trong 1 lần chạy (mặc định: 10)
 */
export async function syncPortalNews(maxItems = 10) {
  console.log('\n======================================================');
  console.log('🏛️ BẮT ĐẦU ĐỒNG BỘ TIN TỨC TỪ CỔNG TTĐT XUÂN LỘC (VĂN HÓA - XÃ HỘI)');
  console.log('======================================================\n');

  try {
    const feedItems = await fetchPortalNewsFeed();
    const itemsToProcess = feedItems.slice(0, maxItems);
    console.log(`📋 Đã tìm thấy ${feedItems.length} tin tức. Đang xử lý ${itemsToProcess.length} tin gần nhất...`);

    let successCount = 0;
    for (let i = 0; i < itemsToProcess.length; i++) {
      const item = itemsToProcess[i];
      console.log(`\n[${i + 1}/${itemsToProcess.length}] Đang xử lý: "${item.title}"`);
      
      try {
        const detail = await fetchPortalArticleDetail(item.link);
        const article = await transformPortalPostToArticle(item, detail);

        if (article.shouldPublish) {
          const savedPath = saveArticleToMarkdown(article);
          console.log(`✨ Đã lưu bài báo: ${savedPath}`);
          successCount++;
        } else {
          console.log(`⛔ Bỏ qua: ${article.rejectReason}`);
        }
      } catch (postErr) {
        console.warn(`⚠️ Bỏ qua bài viết "${item.title}" do lỗi:`, postErr.message);
      }

      // Nghỉ 3s giữa các request để giữ an toàn rate limit
      if (i < itemsToProcess.length - 1) {
        await sleep(3000);
      }
    }

    console.log(`\n🎉 HOÀN THÀNH: Đã xuất bản ${successCount}/${itemsToProcess.length} bài viết từ Cổng TTĐT Xuân Lộc.`);
  } catch (err) {
    console.error('❌ Lỗi trong quá trình đồng bộ Cổng TTĐT:', err);
  }
}

