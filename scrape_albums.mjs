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

async function scrapeAlbums() {
  try {
    const html = await get('https://thptxuanloc.edu.vn/albums/');
    console.log('HTML Length:', html.length);
    
    // Tìm các thẻ liên kết hoặc hình ảnh album
    const linkRegex = /href=["'](\/albums\/[^"']+|https?:\/\/thptxuanloc\.edu\.vn\/albums\/[^"']+)["']/gi;
    const imgRegex = /src=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/gi;
    
    let match;
    const albumLinks = new Set();
    while ((match = linkRegex.exec(html)) !== null) {
      albumLinks.add(match[1]);
    }
    
    const albumImages = new Set();
    while ((match = imgRegex.exec(html)) !== null) {
      albumImages.add(match[1]);
    }
    
    console.log('Found album links:', Array.from(albumLinks));
    console.log('Found album images:', Array.from(albumImages));
  } catch (err) {
    console.error('Scrape error:', err);
  }
}

scrapeAlbums();
