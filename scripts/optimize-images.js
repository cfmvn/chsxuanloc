import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_ASSETS_DIR = path.join(process.cwd(), 'public', 'assets');
const POSTS_CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'posts');

// Đệ quy tìm toàn bộ các file ảnh trong thư mục
function getAllImageFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllImageFiles(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

// Tìm toàn bộ file markdown
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

async function convertAndOptimize() {
  console.log('🚀 Bắt đầu quét và tối ưu hóa toàn bộ hình ảnh trong public/assets/...\n');
  const imageFiles = getAllImageFiles(PUBLIC_ASSETS_DIR);
  console.log(`📸 Tìm thấy tổng cộng ${imageFiles.length} file ảnh (.png, .jpg, .jpeg)`);

  let convertedCount = 0;
  let totalSavedBytes = 0;
  const replacements = []; // lưu { oldRelPath, newRelPath }

  for (const imgPath of imageFiles) {
    const originalSize = fs.statSync(imgPath).size;
    const ext = path.extname(imgPath);
    const targetWebpPath = imgPath.slice(0, -ext.length) + '.webp';

    try {
      // Đọc buffer gốc
      const inputBuffer = fs.readFileSync(imgPath);

      // Convert sang WebP và resize tối đa 1600px
      const outputBuffer = await sharp(inputBuffer)
        .rotate()
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      // Ghi file webp mới
      fs.writeFileSync(targetWebpPath, outputBuffer);
      const newSize = outputBuffer.length;

      // Xóa file ảnh cũ nếu khác đuôi .webp
      if (imgPath !== targetWebpPath) {
        fs.unlinkSync(imgPath);
      }

      const saved = originalSize - newSize;
      totalSavedBytes += saved;
      convertedCount++;

      // Chuẩn hóa đường dẫn tương đối URL (ví dụ: /assets/posts/slug/anh-1.png -> /assets/posts/slug/anh-1.webp)
      const oldUrl = imgPath.replace(path.join(process.cwd(), 'public'), '').replace(/\\/g, '/');
      const newUrl = targetWebpPath.replace(path.join(process.cwd(), 'public'), '').replace(/\\/g, '/');
      
      replacements.push({ oldUrl, newUrl });

      if (originalSize > 1024 * 1024) {
        console.log(`✅ [${convertedCount}/${imageFiles.length}] ${path.basename(imgPath)} -> .webp | ${(originalSize / 1024 / 1024).toFixed(2)} MB ➔ ${(newSize / 1024).toFixed(0)} KB (giảm ${((saved / originalSize) * 100).toFixed(0)}%)`);
      }
    } catch (err) {
      console.error(`⚠️ Lỗi xử lý ${imgPath}:`, err.message);
    }
  }

  console.log(`\n🎉 Đã nén thành công ${convertedCount} hình ảnh.`);
  console.log(`💾 Tổng dung lượng tiết kiệm được: ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB!\n`);

  console.log('📝 Đang cập nhật lại đường dẫn ảnh trong tất cả các bài viết Markdown (.md)...');
  const mdFiles = getAllMarkdownFiles(POSTS_CONTENT_DIR);
  let updatedMdCount = 0;

  for (const mdPath of mdFiles) {
    let content = fs.readFileSync(mdPath, 'utf8');
    let hasChanged = false;

    for (const { oldUrl, newUrl } of replacements) {
      if (content.includes(oldUrl)) {
        content = content.replaceAll(oldUrl, newUrl);
        hasChanged = true;
      }
    }

    // Thay thế regex tổng quát cho các đuôi .png và .jpg nếu còn sót trong /assets/posts/
    const updatedContent = content.replace(/(\/assets\/posts\/[^/\s"'\)]+\/[^/\s"'\)]+)\.(png|jpg|jpeg)/gi, '$1.webp');
    if (updatedContent !== content) {
      content = updatedContent;
      hasChanged = true;
    }

    if (hasChanged) {
      fs.writeFileSync(mdPath, content, 'utf8');
      updatedMdCount++;
    }
  }

  console.log(`✨ Đã cập nhật xong ${updatedMdCount} file bài viết Markdown.`);
}

convertAndOptimize();
