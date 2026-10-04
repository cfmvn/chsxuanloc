import fs from 'fs';
import path from 'path';
import { 
  fetchHttp, 
  decodeEntities, 
  slugify, 
  fetchPortalArticleDetail, 
  transformPortalPostToArticle, 
  saveArticleToMarkdown 
} from './portalNewsAiPipeline.js';
import { transformFacebookPostToArticle } from './facebookAiPipeline.js';

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

/**
 * Trích xuất danh sách bài viết từ một trang danh mục
 */
async function getArticlesFromPage(pageNumber) {
  const url = pageNumber === 1
    ? 'https://xuanloc.dongnai.gov.vn/vi/news/van-hoa-xa-hoi/'
    : `https://xuanloc.dongnai.gov.vn/vi/news/van-hoa-xa-hoi/page-${pageNumber}/`;

  try {
    const html = await fetchHttp(url);
    const linkMatches = [...html.matchAll(/href=["'](\/vi\/news\/van-hoa-xa-hoi\/[a-z0-9-]+-(\d+)\.html)["'][^>]*>([\s\S]*?)<\/a>/gi)];
    
    const articles = [];
    const seenLinks = new Set();

    for (const m of linkMatches) {
      const link = 'https://xuanloc.dongnai.gov.vn' + m[1];
      const title = decodeEntities(m[3].replace(/<[^>]+>/g, '').trim());
      if (title && title.length > 10 && !seenLinks.has(link)) {
        seenLinks.add(link);
        articles.push({ title, link });
      }
    }
    return articles;
  } catch (err) {
    console.error(`⚠️ Lỗi khi tải trang ${pageNumber}:`, err.message);
    return [];
  }
}

/**
 * Quét toàn bộ tin tức từ đầu năm 2026 đến nay (Trang 1 -> 16)
 * @param {Object} options { startPage: 1, endPage: 16, maxArticles: 100 }
 */
export async function backfillHistoricalPortalNews(options = {}) {
  const startPage = options.startPage || 1;
  const endPage = options.endPage || 16;
  const maxArticles = options.maxArticles || 100;

  console.log('\n======================================================');
  console.log(`🏛️ BẮT ĐẦU QUÉT TIN TỨC LỊCH SỬ NĂM 2026 (TRANG ${startPage} -> ${endPage})`);
  console.log('======================================================\n');

  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
  let totalProcessed = 0;
  let newPublished = 0;
  let alreadyExists = 0;

  for (let p = startPage; p <= endPage; p++) {
    console.log(`\n📄 [TRANG ${p}/${endPage}] Đang quét danh sách bài viết...`);
    const pageArticles = await getArticlesFromPage(p);
    console.log(`👉 Tìm thấy ${pageArticles.length} bài viết trên trang ${p}.`);

    for (let i = 0; i < pageArticles.length; i++) {
      if (totalProcessed >= maxArticles) {
        console.log(`\n🛑 Đã đạt giới hạn tối đa ${maxArticles} bài cần xử lý.`);
        break;
      }

      const item = pageArticles[i];
      const testSlug = slugify(item.title);
      const filePath = path.join(postsDir, `${testSlug}.md`);

      // 1. Kiểm tra nếu bài viết đã tồn tại -> Bỏ qua ngay lập tức để bảo vệ dữ liệu
      if (fs.existsSync(filePath)) {
        console.log(`⏩ [ĐÃ CÓ] ${item.title}`);
        alreadyExists++;
        continue;
      }

      // 2. Tải chi tiết bài báo, toàn bộ ảnh gốc và chuyển sang Markdown
      console.log(`\n📥 Đang tải [Trang ${p} - Bài ${i + 1}/${pageArticles.length}]: "${item.title}"`);
      try {
        const detail = await fetchPortalArticleDetail(item.link);
        if (!detail.fullMarkdown || detail.fullMarkdown.length < 80) {
          console.log(`⚠️ Bài viết không có nội dung hợp lệ, bỏ qua.`);
          continue;
        }

        const article = await transformPortalPostToArticle(item, detail);
        if (article.shouldPublish) {
          const saved = saveArticleToMarkdown(article, { overwrite: false });
          if (saved) {
            console.log(`✨ Xuất bản thành công: ${saved}`);
            newPublished++;
          }
        }
        totalProcessed++;
      } catch (err) {
        console.warn(`⚠️ Bỏ qua bài "${item.title}" do lỗi:`, err.message);
      }

      // Nghỉ 1s giữa các bài để đảm bảo an toàn kết nối
      await sleep(1000);
    }

    if (totalProcessed >= maxArticles) break;
  }

  console.log('\n======================================================');
  console.log(`🎉 TỔNG KẾT QUÉT TIN TỨC NĂM 2026:`);
  console.log(`- Bài viết mới được xuất bản & lưu ảnh gốc: ${newPublished}`);
  console.log(`- Bài viết đã có sẵn trên hệ thống (giữ nguyên): ${alreadyExists}`);
  console.log('======================================================\n');
}

/**
 * Quét hàng loạt tin tức lịch sử từ Fanpage Facebook
 */
export async function backfillHistoricalPosts(posts = []) {
  console.log(`\n======================================================`);
  console.log(`🚀 BẮT ĐẦU QUÉT & XỬ LÝ ${posts.length} BÀI ĐĂNG TỪ ĐẦU NĂM ĐẾN NAY`);
  console.log(`======================================================\n`);

  let publishedCount = 0;
  let rejectedCount = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    console.log(`\n[${i + 1}/${posts.length}] Đang xử lý bài đăng: "${post.content.substring(0, 70).replace(/\n/g, ' ')}..."`);

    try {
      const article = await transformFacebookPostToArticle(post);

      if (article.shouldPublish === false) {
        console.log(`⛔ [BỘ LỌC TỪ CHỐI]: ${article.rejectReason || 'Không có giá trị tin tức sự kiện'}`);
        rejectedCount++;
      } else {
        const savedPath = saveArticleToMarkdown(article, { overwrite: false });
        if (savedPath) {
          publishedCount++;
        }
      }
    } catch (err) {
      console.error(`❌ Lỗi khi xử lý bài viết qua AI:`, err.message);
    }
  }

  console.log(`\n🎉 TỔNG KẾT: Đã xuất bản ${publishedCount} bài báo.`);
}

// Chạy trực tiếp
if (process.argv[1] && process.argv[1].includes('backfillHistoricalNews')) {
  backfillHistoricalPortalNews({ startPage: 1, endPage: 16, maxArticles: 100 });
}
