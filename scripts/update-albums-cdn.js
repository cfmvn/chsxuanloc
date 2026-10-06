import fs from 'fs';
import path from 'path';

const p = path.join(process.cwd(), 'src', 'data', 'albums.json');
let content = fs.readFileSync(p, 'utf8');
content = content.replace(/\/assets\/albums\/([^/]+)\/([^"']+)\.(JPG|jpg|jpeg|png|webp)/gi, 'https://cdn.chsxuanloc.com/albums/$1/$2.webp');
fs.writeFileSync(p, content, 'utf8');
console.log('✅ Đã cập nhật toàn bộ ảnh trong albums.json sang https://cdn.chsxuanloc.com/albums/...');
