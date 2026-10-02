import https from 'https';
import fs from 'fs';

const url = 'https://thptxuanloc.edu.vn/cong-khai-thong-tin/danh-sach-cuu-hoc-sinh-tu-1986-den-2011-51.html';

https.get(url, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    fs.writeFileSync('scratch_article.html', html);
    console.log('Saved scratch_article.html, size:', html.length);

    // Search for links
    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    const links = [];
    while ((match = linkRegex.exec(html)) !== null) {
      links.push({ href: match[1], text: match[2].replace(/<[^>]+>/g, '').trim() });
    }

    console.log('Total links found:', links.length);
    const fileLinks = links.filter(l => 
      l.href.includes('.xls') || 
      l.href.includes('.xlsx') || 
      l.href.includes('.pdf') || 
      l.href.includes('.zip') || 
      l.href.includes('/uploads/') ||
      l.href.includes('drive.google') ||
      l.href.includes('mediafire') ||
      l.href.includes('box.com') ||
      l.text.includes('198') ||
      l.text.includes('199') ||
      l.text.includes('200') ||
      l.text.includes('201') ||
      l.text.includes('Khóa') ||
      l.text.includes('khóa')
    );
    console.log('Filtered relevant links:', JSON.stringify(fileLinks, null, 2));
  });
}).on('error', err => console.error(err));
