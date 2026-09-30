import https from 'https';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function testSingleAlbum() {
  const html = await get('https://thptxuanloc.edu.vn/albums/xem-album/Cuu-hoc-sinh-Xuan-Loc-3/');
  console.log('Album Detail HTML Length:', html.length);
  
  // Trích xuất toàn bộ ảnh bên trong album
  const imgRegex = /src=["'](\/uploads\/albums\/[^"']+|\/data\/[^"']+)["']/gi;
  let match;
  const imgs = new Set();
  while ((match = imgRegex.exec(html)) !== null) {
    imgs.add(match[1]);
  }
  console.log('Images inside Cuu-hoc-sinh album:', Array.from(imgs));
}

testSingleAlbum();
