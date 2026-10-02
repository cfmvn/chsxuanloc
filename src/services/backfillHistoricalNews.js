import fs from 'fs';
import path from 'path';
import { transformFacebookPostToArticle, saveArticleToMarkdown } from './facebookAiPipeline.js';

/**
 * Script quét hàng loạt tin tức lịch sử từ đầu năm 2026 đến nay
 * và chạy qua bộ lọc AI Groq để tạo bài báo Markdown hoàn chỉnh
 */
export async function backfillHistoricalPosts(posts = []) {
  console.log(`\n======================================================`);
  console.log(`🚀 BẮT ĐẦU QUÉT & XỬ LÝ ${posts.length} BÀI ĐĂNG TỪ ĐẦU NĂM ĐẾN NAY`);
  console.log(`======================================================\n`);

  let publishedCount = 0;
  let rejectedCount = 0;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    console.log(`\n------------------------------------------------------`);
    console.log(`[${i + 1}/${posts.length}] Đang xử lý bài đăng: "${post.content.substring(0, 70).replace(/\n/g, ' ')}..."`);
    console.log(`- Thời gian gốc: ${post.postedAt}`);
    console.log(`- Số lượng ảnh: ${(post.mediaUrls || []).length} ảnh`);

    try {
      const article = await transformFacebookPostToArticle(post);

      if (article.shouldPublish === false) {
        console.log(`⛔ [BỘ LỌC TỪ CHỐI]: ${article.rejectReason || 'Không có giá trị tin tức sự kiện'}`);
        rejectedCount++;
      } else {
        const savedPath = saveArticleToMarkdown(article);
        console.log(`✨ [XUẤT BẢN THÀNH CÔNG]:`);
        console.log(`   + Tiêu đề: "${article.title}"`);
        console.log(`   + Chuyên mục: [${article.category}]`);
        console.log(`   + Ngày sự kiện: ${article.pubDate}`);
        console.log(`   + File lưu: ${savedPath}`);
        publishedCount++;
      }
    } catch (err) {
      console.error(`❌ Lỗi khi xử lý bài viết qua AI:`, err.message);
    }
  }

  console.log(`\n======================================================`);
  console.log(`🎉 TỔNG KẾT QUÉT TOÀN BỘ TỪ ĐẦU NĂM:`);
  console.log(`- Đã xuất bản thành công: ${publishedCount} bài báo hoàn chỉnh`);
  console.log(`- Đã lọc bỏ (spam/không tin tức): ${rejectedCount} bài viết`);
  console.log(`======================================================\n`);
}
