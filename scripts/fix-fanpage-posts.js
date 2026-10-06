import fs from 'fs';
import path from 'path';

const posts = [
  {
    file: 'mo-loi-tuong-lai-cung-xuan-loc-ers.md',
    link: 'https://www.facebook.com/1439338274957017/posts/1442563241301187'
  },
  {
    file: 'mang-ghep-moi-da-dai-gia-dinh-clb-truyen-thong-xuan-loc-moi.md',
    link: 'https://www.facebook.com/1439338274957017/posts/1440495768174601'
  },
  {
    file: 'flashmob-san-truong-thpt-xuan-loc-dem-nguc.md',
    link: 'https://www.facebook.com/1439338274957017/posts/1438787011678810'
  },
  {
    file: 'vinh-danh-hoc-sinh-vao-doi-tuyen-hoc-sinh-gioi-quoc-gia-nam-2026.md',
    link: 'https://www.facebook.com/1439338274957017/posts/1432244248999753'
  },
  {
    file: 'thpt-xuan-loc-hinh-sang-giai-nhi-cuoc-thi-sang-tao-thanh-thien-nien-2026.md',
    link: 'https://www.facebook.com/1439338274957017/posts/1430932822464229'
  }
];

const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');

posts.forEach(({ file, link }) => {
  const p = path.join(postsDir, file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    
    // Fix escaped newlines
    if (content.includes('\\n')) {
      content = content.replace(/\\n/g, '\n');
    }

    // Add footer if missing
    if (!content.includes('Nguồn: Ban Chấp hành Đoàn Trường THPT Xuân Lộc')) {
      content = content.trim() + `\n\n---\n*Nguồn: Ban Chấp hành Đoàn Trường THPT Xuân Lộc ([Bài viết gốc trên Fanpage Facebook](${link}))*\n`;
    }

    fs.writeFileSync(p, content, 'utf8');
    console.log(`✅ Đã định dạng lại bài viết: ${file}`);
  }
});
