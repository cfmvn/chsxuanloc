import fs from 'fs';
import path from 'path';

function getEnvVar(key, fallback = '') {
  if (process.env[key]) return process.env[key];
  try {
    const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
    const match = envContent.match(new RegExp(`${key}=([^\\r\\n]+)`));
    return match ? match[1].trim() : fallback;
  } catch (e) {
    return fallback;
  }
}

const GROQ_API_KEY = getEnvVar('GROQ_API_KEY');

const memoryPrompts = [
  "Bài thơ hoặc tản văn hoài niệm về hàng cây phượng vĩ, tiếng ve kêu và ngày chia tay bế giảng năm ấy dưới mái trường THPT Xuân Lộc.",
  "Dòng tâm sự bồi hồi về người bạn cùng bàn năm xưa, những trò nghịch ngợm ngây ngô thời áo trắng và những buổi tan trường đạp xe qua phố huyện Xuân Lộc.",
  "Kỷ niệm xúc động về người thầy/cô giáo cũ đã tận tụy dạy dỗ, lời nhắc nhở ân cần bên bục giảng đã tiếp thêm động lực cho chặng đường trưởng thành.",
  "Tản văn về những sáng thứ Hai chào cờ trang nghiêm, tà áo dài trắng thướt tha sân trường và những ước mơ bay bổng thuở 17-18 tuổi.",
  "Lời tâm tình từ một cựu học sinh xa quê lập nghiệp ở thành phố, nhớ về mái trường xưa, nhớ góc căn-tin, sân bóng và những người bạn cũ Khóa 2007.",
  "Bài thơ 4 chữ hoặc lục bát dạt dào cảm xúc về tiếng trống trường ngày khai giảng, về thầy cô và phấn trắng bảng đen của trường cấp 3 Xuân Lộc.",
  "Dòng hồi ức về những mùa thi tốt nghiệp căng thẳng nhưng ấm áp, những cuốn lưu bút chuyền tay nhau và nhánh hoa phượng ép khô trong trang vở."
];

/**
 * Sinh nội dung tâm sự/bài thơ bằng Groq AI
 */
async function generateStoryContent() {
  const chosenPrompt = memoryPrompts[Math.floor(Math.random() * memoryPrompts.length)];
  const dayOfWeek = new Date().getDay();
  const isPoem = dayOfWeek === 2 || dayOfWeek === 6; // Thứ 3 và Thứ 7 ưu tiên làm thơ

  const prompt = `
Bạn là một cựu học sinh trường THPT Xuân Lộc (tỉnh Đồng Nai), niên khóa 2004 - 2007 (Khóa 2007).
Hãy viết một bài ${isPoem ? 'thơ (lục bát, 7 chữ hoặc 8 chữ)' : 'tản văn / dòng tâm sự'} đong đầy cảm xúc, hoài niệm và sâu lắng về thời học sinh dưới mái trường THPT Xuân Lộc.

Chủ đề gợi ý hôm nay:
"${chosenPrompt}"

Yêu cầu nội dung:
1. Giọng văn chân thành, hoài niệm, ngôn từ trong sáng, giàu chất thơ và cảm xúc học đường.
2. Gợi nhắc một số nét đặc trưng gần gũi: Cây phượng vĩ, núi Chứa Chan xa xa, con đường đất đỏ, tiếng trống trường, tà áo dài, bảng đen phấn trắng, bạn cùng bàn, thầy cô thân thương.
3. Độ dài: ${isPoem ? 'khoảng 4 - 6 khổ thơ' : 'khoảng 3 - 5 đoạn văn ngắn gọn, xúc động (250 - 450 từ)'}.
4. Định dạng trả về JSON thuần túy (không bọc markdown block):
{
  "title": "Tiêu đề bài viết hoặc bài thơ thật hay, gợi cảm xúc",
  "topic": "ao-trang" (hoặc "thay-co" / "lap-nghiep" / "tam-tinh"),
  "message": "Nội dung bài thơ hoặc tản văn hoàn chỉnh"
}
`;

  if (!GROQ_API_KEY) {
    throw new Error('Chưa cấu hình GROQ_API_KEY trong môi trường!');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: 'You are a sentimental Vietnamese alumnus and poetic writer from THPT Xuan Loc. You ALWAYS return a valid JSON object with keys: title, topic, message.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const rawContent = resJson.choices[0].message.content.trim();
  const cleanJson = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
  return JSON.parse(cleanJson);
}

/**
 * Lưu bài viết vào kho dữ liệu JSON an toàn & gửi thông báo
 */
export async function createDailyTamSuPost() {
  console.log('🤖 Bắt đầu chạy tiến trình AI tạo bài tâm sự cựu học sinh...');
  
  try {
    const storyData = await generateStoryContent();
    console.log(`✨ AI đã sáng tác thành công: "${storyData.title}" (Chủ đề: ${storyData.topic})`);

    const dataFilePath = path.join(process.cwd(), 'src', 'data', 'tamSuStore.json');
    let stories = [];
    if (fs.existsSync(dataFilePath)) {
      try {
        stories = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
      } catch (e) {
        stories = [];
      }
    }

    const newId = `ts-${Date.now()}`;
    const newEntry = {
      id: newId,
      fullName: 'CHS Xuân Lộc',
      batch: 'Khóa 2004 - 2007',
      className: 'Khóa 2007',
      topic: storyData.topic || 'ao-trang',
      title: storyData.title,
      message: storyData.message,
      imageUrl: '',
      status: 'pending', // Luôn để pending để Admin duyệt trước
      isAiGenerated: true,
      createdAt: new Date().toISOString()
    };

    stories.unshift(newEntry);
    fs.writeFileSync(dataFilePath, JSON.stringify(stories, null, 2), 'utf8');
    console.log(`💾 Đã lưu bài viết vào ${dataFilePath} (ID: ${newId}) ở trạng thái 'pending' (Chờ duyệt).`);

    // Gửi thông báo Telegram cho Admin nếu có cấu hình
    const telegramBotToken = getEnvVar('TELEGRAM_BOT_TOKEN');
    const telegramChatId = getEnvVar('TELEGRAM_CHAT_ID');

    if (telegramBotToken && telegramChatId) {
      try {
        const notifyText = `🔔 *[CHSXUANLOC.COM]* 📝 BÀI TÂM SỰ MỚI TỪ AI (CHỜ DUYỆT)

👤 *Người đăng:* CHS Xuân Lộc
🎓 *Niên khóa:* Khóa 2004 - 2007
📌 *Tiêu đề:* ${storyData.title}
💬 *Nội dung tóm tắt:*
_${storyData.message.substring(0, 250)}..._

👉 _Admin vui lòng truy cập https://chsxuanloc.com/admin để xem toàn văn và bấm duyệt!_`;

        await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: notifyText,
            parse_mode: 'Markdown'
          })
        });
        console.log('📲 Đã gửi thông báo Telegram đến Admin.');
      } catch (tgErr) {
        console.warn('Lỗi gửi Telegram:', tgErr);
      }
    }

    return { success: true, id: newId, title: storyData.title };
  } catch (err) {
    console.error('❌ Lỗi khi tự động tạo bài tâm sự:', err);
    throw err;
  }
}

// Cho phép chạy trực tiếp từ dòng lệnh: node src/services/autoDailyTamSu.js
if (process.argv[1] && process.argv[1].includes('autoDailyTamSu.js')) {
  createDailyTamSuPost().then(() => process.exit(0)).catch(() => process.exit(1));
}
