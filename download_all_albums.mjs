import https from 'https';
import fs from 'fs';
import path from 'path';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest)) return resolve(true);
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      } else {
        fs.unlink(dest, () => {});
        resolve(false);
      }
    }).on('error', () => {
      fs.unlink(dest, () => {});
      resolve(false);
    });
  });
}

async function fetchAllAlbums() {
  console.log('--- Đang quét danh mục Album từ thptxuanloc.edu.vn ---');
  const indexHtml = await get('https://thptxuanloc.edu.vn/albums/');
  
  // Trích xuất các album: URL và Tiêu đề
  const albumRegex = /<a[^>]+href=["'](\/albums\/xem-album\/([^"']+)\/)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  const albumMap = new Map();

  while ((match = albumRegex.exec(indexHtml)) !== null) {
    const rawUrl = match[1];
    const slug = match[2];
    const titleMatch = match[3].replace(/<[^>]+>/g, '').trim();
    if (slug && !albumMap.has(slug) && titleMatch.length > 2) {
      albumMap.set(slug, {
        slug: slug.toLowerCase(),
        title: titleMatch,
        url: `https://thptxuanloc.edu.vn${rawUrl}`
      });
    }
  }

  console.log(`Tìm thấy ${albumMap.size} albums! Bắt đầu crawl chi tiết...`);
  
  const albumsData = [];
  const baseImgDir = path.join(process.cwd(), 'public', 'assets', 'albums');
  if (!fs.existsSync(baseImgDir)) {
    fs.mkdirSync(baseImgDir, { recursive: true });
  }

  for (const [slug, info] of albumMap.entries()) {
    try {
      console.log(`Đang xử lý album: ${info.title} (${slug})...`);
      const detailHtml = await get(info.url);
      
      const imgRegex = /src=["'](\/uploads\/albums\/pic_cache\/[^"']+|\/uploads\/albums\/[^"']+)["']/gi;
      let imgMatch;
      const imagesList = [];
      const albumFolder = path.join(baseImgDir, slug.toLowerCase());
      if (!fs.existsSync(albumFolder)) {
        fs.mkdirSync(albumFolder, { recursive: true });
      }

      const imgUrls = new Set();
      while ((imgMatch = imgRegex.exec(detailHtml)) !== null) {
        imgUrls.add(imgMatch[1]);
      }

      let count = 0;
      for (const relativeImgUrl of Array.from(imgUrls)) {
        count++;
        const filename = path.basename(relativeImgUrl);
        const fullImgUrl = `https://thptxuanloc.edu.vn${relativeImgUrl}`;
        const localDest = path.join(albumFolder, filename);
        const publicUrl = `/assets/albums/${slug.toLowerCase()}/${filename}`;

        await downloadImage(fullImgUrl, localDest);
        imagesList.push({
          src: publicUrl,
          caption: `${info.title} - Ảnh ${count}`
        });
      }

      albumsData.push({
        title: info.title,
        slug: slug.toLowerCase(),
        coverImage: imagesList[0]?.src || '/assets/images/truong-xuan-loc.jpg',
        photoCount: imagesList.length,
        photos: imagesList,
      });

    } catch (err) {
      console.error(`Lỗi tải album ${slug}:`, err.message);
    }
  }

  // Ghi file JSON dữ liệu album hoàn chỉnh
  const dataPath = path.join(process.cwd(), 'src', 'data', 'albums.json');
  fs.mkdirSync(path.dirname(dataPath), { recursive: true });
  fs.writeFileSync(dataPath, JSON.stringify(albumsData, null, 2), 'utf-8');
  console.log(`\n Hoàn tất tải toàn bộ ${albumsData.length} albums về thư mục dự án!`);
}

fetchAllAlbums();
