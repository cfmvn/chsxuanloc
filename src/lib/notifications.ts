/**
 * Helper gửi thông báo cho Ban Quản trị khi có bài viết/tâm sự mới
 */
export async function notifyAdminNewSubmission(data: {
  title: string;
  author: string;
  batch?: string;
  summary: string;
  type: 'tam_su' | 'ky_yeu' | 'hoc_bong' | 'tri_an';
}) {
  const telegramBotToken = import.meta.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = import.meta.env.TELEGRAM_CHAT_ID;

  // 1. Thử gửi qua Telegram nếu cấu hình Token & ChatId
  if (telegramBotToken && telegramChatId) {
    try {
      const typeLabel = {
        tam_su: '📝 BÀI TÂM SỰ / KỶ NIỆM MỚI',
        ky_yeu: '🎓 LƯU BÚT KỶ YẾU MỚI',
        hoc_bong: '🎁 ĐĂNG KÝ HỌC BỔNG MỚI',
        tri_an: '💐 LỜI TRI ÂN THẦY CÔ MỚI'
      }[data.type] || '📩 THÔNG BÁO MỚI';

      const text = `🔔 *[CHSXUANLOC.COM]* ${typeLabel}

👤 *Người gửi:* ${data.author}
🎓 *Niên khóa:* ${data.batch || 'Chung'}
📌 *Tiêu đề:* ${data.title}
💬 *Nội dung tóm tắt:*
_${data.summary.substring(0, 300)}${data.summary.length > 300 ? '...' : ''}_

👉 _Vui lòng truy cập https://chsxuanloc.com/admin để phê duyệt bài viết._`;

      await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: text,
          parse_mode: 'Markdown'
        })
      });
      console.log('✅ Đã gửi thông báo Telegram đến Admin thành công');
      return;
    } catch (err) {
      console.warn('Lỗi khi gửi thông báo Telegram:', err);
    }
  }

  // 2. Fallback: Log cảnh báo hệ thống
  console.log(`[Admin Notification] New submission from ${data.author}: ${data.title}`);
}
