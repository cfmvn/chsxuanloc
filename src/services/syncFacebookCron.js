import { transformFacebookPostToArticle, saveArticleToMarkdown } from './facebookAiPipeline.js';
import { fetchHttp, decodeEntities } from './portalNewsAiPipeline.js';

const FANPAGE_RSS_URL = 'https://fetchrss.com/feed/1xDule5Sb8x81xDukmAi88f4.rss';

/**
 * Cào và bóc tách các bài viết từ RSS Feed của Fanpage Facebook
 */
export async function fetchFanpagePostsFromRss() {
  console.log(`📡 Đang quét RSS Fanpage THPT Xuân Lộc từ: ${FANPAGE_RSS_URL}`);

  const xmlData = await fetchHttp(FANPAGE_RSS_URL);
  const items = [];
  const itemMatches = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];

  for (const itemXml of itemMatches) {
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
    const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
    const descMatch = itemXml.match(/<description>([\s\S]*?)<\/description>/);
    const guidMatch = itemXml.match(/<guid[^>]*>(.*?)<\/guid>/);

    const link = linkMatch ? linkMatch[1].trim() : '';
    const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';
    const descRaw = descMatch ? descMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : '';
    const guid = guidMatch ? guidMatch[1].trim() : '';

    if (!descRaw) continue;

    // Trích xuất toàn bộ link ảnh trong thẻ description
    const mediaUrls = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    while ((match = imgRegex.exec(descRaw)) !== null) {
      let src = decodeEntities(match[1].trim());
      if (src && !src.includes('provider/facebook.png') && !src.includes('fetchrss')) {
        mediaUrls.push(src);
      }
    }

    // Bóc tách text thuần từ description (loại bỏ thẻ HTML và chú thích FetchRSS)
    let cleanText = descRaw
      .replace(/<img[^>]*>/gi, '')
      .replace(/<br\s*[\/]?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\(Feed generated with.*?\)/gi, '')
      .trim();

    cleanText = decodeEntities(cleanText);

    if (cleanText.length > 15) {
      items.push({
        guid,
        link,
        postedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        content: cleanText,
        mediaUrls
      });
    }
  }

  return items;
}

/**
 * Hàm chạy đồng bộ Fanpage chính
 */
export async function syncFacebookFanpage() {
  try {
    const posts = await fetchFanpagePostsFromRss();
    console.log(`📦 Tìm thấy ${posts.length} bài đăng mới từ Fanpage.`);

    let createdCount = 0;
    for (const post of posts) {
      console.log(`\n======================================================`);
      console.log(`🔍 [FANPAGE] Đang xử lý: "${post.content.substring(0, 60)}..."`);
      console.log(`📸 Số lượng ảnh đính kèm: ${post.mediaUrls.length} ảnh`);

      try {
        const article = await transformFacebookPostToArticle(post);

        if (article.shouldPublish === false) {
          console.log(`⛔ [BỘ LỌC TỪ CHỐI]: ${article.rejectReason || 'Nội dung không đạt tiêu chuẩn tin tức'}`);
          continue;
        }

        const savedPath = saveArticleToMarkdown(article, { overwrite: false });
        if (savedPath) {
          createdCount++;
          console.log(`✅ [XUẤT BẢN THÀNH CÔNG]: ${article.title} -> ${article.slug}.md`);
        }
      } catch (err) {
        console.error(`⚠️ Lỗi xử lý bài viết:`, err.message);
      }
    }

    console.log(`\n🎉 Đồng bộ Fanpage hoàn tất! Đã thêm mới ${createdCount} bài báo.`);
  } catch (err) {
    console.error(`❌ Lỗi đồng bộ Fanpage Facebook:`, err.message);
  }
}

// Chạy trực tiếp nếu execute qua CLI
if (process.argv[1] && process.argv[1].endsWith('syncFacebookCron.js')) {
  syncFacebookFanpage();
}
