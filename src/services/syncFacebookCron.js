import { transformFacebookPostToArticle, saveArticleToMarkdown } from './facebookAiPipeline.js';

/**
 * Script quét và đồng bộ bài viết từ Fanpage Facebook
 * Chạy tự động qua GitHub Actions hoặc Node.js cron
 */
async function fetchFanpagePosts() {
  console.log('📡 Đang quét dữ liệu mới nhất từ Fanpage Đoàn Trường THPT Xuân Lộc...');

  // Ghi chú: Sử dụng API/Puppeteer/RSS-Bridge để lấy các bài đăng gần nhất
  // Mô phỏng 2 bài đăng thực tế (1 bài sự kiện nhà trường + 1 bài spam cần lọc)
  const postsFromFanpage = [
    {
      id: 'fb-post-889101',
      postedAt: new Date().toISOString(),
      mediaUrls: ['https://thptxuanloc.edu.vn/uploads/40namthptxuanloc.jpg'],
      content: `[THÔNG BÁO: PHÁT ĐỘNG PHONG TRÀO THI ĐUA CHÀO MỪNG NGÀY NHÀ GIÁO VIỆT NAM 20/11]
Nhằm phát huy truyền thống "Tôn sư trọng đạo" và tạo sân chơi học thuật bổ ích cho toàn thể đoàn viên thanh niên, Ban Chấp hành Đoàn trường THPT Xuân Lộc chính thức phát động đợt thi đua cao điểm:
1. Hội thi Báo tường & Làm tập san tri ân thầy cô.
2. Phong trào "Hoa điểm 10 dâng tặng thầy cô" giữa các chi đoàn khối 10, 11, 12.
3. Giải bóng đá truyền thống Cựu học sinh - Giáo viên và Học sinh năm 2026.
Thời gian diễn ra từ ngày 15/10/2026 đến hết ngày 20/11/2026. Rất mong nhận được sự hưởng ứng nhiệt tình từ quý thầy cô, các bạn học sinh và anh chị cựu học sinh các khóa!`
    },
    {
      id: 'fb-post-spam-002',
      postedAt: new Date().toISOString(),
      mediaUrls: [],
      content: `Chào buổi sáng cả nhà yêu! Chúc mọi người tuần mới vui vẻ nha ❤️❤️❤️`
    }
  ];

  for (const post of postsFromFanpage) {
    console.log(`\n🔍 Đang phân tích bài viết: "${post.content.substring(0, 60)}..."`);
    const article = await transformFacebookPostToArticle(post);

    if (article.shouldPublish === false) {
      console.log(`⛔ [BỘ LỌC TỪ CHỐI]: ${article.rejectReason}`);
    } else {
      console.log(`✨ [BỘ LỌC CHẤP NHẬN]: Chuyên mục "${article.category}" -> Tiêu đề: "${article.title}"`);
    }
  }
}

fetchFanpagePosts();
