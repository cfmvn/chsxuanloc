import fs from 'fs';
import path from 'path';
import { uploadBufferToR2, getR2Config } from '../src/services/r2Storage.js';

const PUBLIC_ASSETS_DIR = path.join(process.cwd(), 'public', 'assets');
const POSTS_CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'posts');

function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.webp', '.png', '.jpg', '.jpeg'].includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

function getAllMarkdownFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllMarkdownFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.md')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

async function migrateAllToR2() {
  const config = getR2Config();
  console.log(`🚀 Bắt đầu di chuyển toàn bộ ảnh từ public/assets sang Cloudflare R2 (${config.publicDomain})...\n`);

  const files = getAllFiles(PUBLIC_ASSETS_DIR);
  console.log(`📸 Tìm thấy tổng cộng ${files.length} ảnh cần upload lên R2.`);

  let uploadedCount = 0;
  const urlMap = new Map(); // oldLocalUrl -> r2CdnUrl

  for (let i = 0; i < files.length; i++) {
    const fullPath = files[i];
    const relPath = fullPath.replace(path.join(process.cwd(), 'public', 'assets'), '').replace(/\\/g, '/');
    const r2Key = relPath.replace(/^\/+/, ''); // ví dụ: "posts/slug/anh-1.webp" hoặc "albums/slug/anh-1.webp"
    const localUrl = `/assets${relPath}`;

    try {
      const buffer = fs.readFileSync(fullPath);
      const ext = path.extname(fullPath).toLowerCase();
      const mime = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';

      const cdnUrl = await uploadBufferToR2(buffer, r2Key, mime);
      urlMap.set(localUrl, cdnUrl);
      
      // Cũng map các bản cũ .png, .jpg nếu markdown còn lưu
      const rawBaseWithoutExt = localUrl.substring(0, localUrl.lastIndexOf('.'));
      urlMap.set(`${rawBaseWithoutExt}.png`, cdnUrl);
      urlMap.set(`${rawBaseWithoutExt}.jpg`, cdnUrl);
      urlMap.set(`${rawBaseWithoutExt}.jpeg`, cdnUrl);

      uploadedCount++;
      if (uploadedCount % 50 === 0 || uploadedCount === files.length) {
        console.log(`☁️ [${uploadedCount}/${files.length}] Uploaded: ${r2Key} -> ${cdnUrl}`);
      }
    } catch (err) {
      console.error(`⚠️ Lỗi upload ${fullPath}:`, err.message);
    }
  }

  console.log(`\n🎉 Đã upload thành công ${uploadedCount} file lên Cloudflare R2!`);

  console.log('\n📝 Đang cập nhật lại URL trong các bài viết Markdown...');
  const mdFiles = getAllMarkdownFiles(POSTS_CONTENT_DIR);
  let updatedMdCount = 0;

  for (const mdPath of mdFiles) {
    let content = fs.readFileSync(mdPath, 'utf8');
    let original = content;

    // Thay thế toàn bộ /assets/posts/ -> https://cdn.chsxuanloc.com/posts/
    content = content.replace(/\/assets\/posts\/([^/\s"'\)]+)\/([^/\s"'\)]+)\.(webp|png|jpg|jpeg)/gi, (match, slug, file, ext) => {
      return `${config.publicDomain}/posts/${slug}/${file}.webp`;
    });

    if (content !== original) {
      fs.writeFileSync(mdPath, content, 'utf8');
      updatedMdCount++;
    }
  }

  console.log(`✨ Đã cập nhật xong ${updatedMdCount} bài viết với link CDN Cloudflare R2.`);
}

migrateAllToR2();
