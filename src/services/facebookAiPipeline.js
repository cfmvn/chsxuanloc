import fs from 'fs';
import path from 'path';

function getGroqKey() {
  if (process.env.GROQ_API_KEY) return process.env.GROQ_API_KEY;
  try {
    const envContent = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
    const match = envContent.match(/GROQ_API_KEY=([^\r\n]+)/);
    return match ? match[1].trim() : '';
  } catch (e) {
    return '';
  }
}

const GROQ_API_KEY = getGroqKey();

/**
 * Viết lại nội dung bài đăng từ Fanpage thành bài báo Markdown hoàn chỉnh
 * @param {Object} rawPost { content, postedAt, mediaUrls, link }
 */
export async function transformFacebookPostToArticle(rawPost) {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not defined in .env');
  }

  const prompt = `
Bạn là Trưởng ban Biên tập Cổng thông tin Cựu học sinh & Nhà trường Trường THPT Xuân Lộc (Đồng Nai).
Dưới đây là nội dung một bài đăng gốc từ Fanpage Đoàn Trường THPT Xuân Lộc (https://www.facebook.com/vpdoan.thptxl):

--- NỘI DUNG GỐC ---
Thời gian đăng: ${rawPost.postedAt || new Date().toISOString()}
Nội dung bài viết:
"""
${rawPost.content}
"""
--- HẾT NỘI DUNG GỐC ---

NHIỆM VỤ CỦA BẠN:
1. Phân tích nội dung, trích xuất sự kiện, thời gian thực diễn ra sự kiện (nếu có nhắc đến trong bài viết) và ý nghĩa hoạt động.
2. Viết lại thành một bài viết tin tức / bài báo trang trọng, hấp dẫn, chuẩn mực báo chí học đường.
3. Phân loại vào 1 trong các chuyên mục: 'Tin tức', 'Sự kiện', 'Họp khóa', 'Gương sáng', 'Tri ân', 'Bảng vàng', 'Lịch sử'.
4. Trả về kết quả dưới dạng JSON thuần túy (không bọc trong \`\`\`json) với cấu trúc:
{
  "title": "Tiêu đề bài báo ngắn gọn, thu hút, đúng phong cách tin tức",
  "slug": "tieu-de-khong-dau-ngan-gon",
  "pubDate": "YYYY-MM-DD",
  "author": "Đoàn Trường THPT Xuân Lộc / Ban Truyền Thông CHS",
  "description": "Tóm tắt ngắn gọn 1-2 câu về nội dung bài viết",
  "category": "Tin tức / Sự kiện / Gương sáng ...",
  "tags": ["Tag1", "Tag2"],
  "markdownBody": "Toàn bộ nội dung bài viết định dạng chuẩn Markdown (có tiêu đề mục ### 1..., đoạn văn rõ ràng, danh sách gạch đầu dòng trang trọng...)"
}
`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: 'You are an expert Vietnamese journalist and school editor. You always output clean JSON without markdown codeblock wrappers.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API Error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const article = JSON.parse(resJson.choices[0].message.content);
  return article;
}

/**
 * Lưu bài báo thành file Markdown trong src/content/posts/
 */
export function saveArticleToMarkdown(article, featuredImage = '/assets/images/default-post.jpg') {
  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts');
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const filePath = path.join(postsDir, `${article.slug}.md`);

  const fileContent = `---
title: ${JSON.stringify(article.title)}
pubDate: ${article.pubDate}
author: ${JSON.stringify(article.author || 'Đoàn Trường THPT Xuân Lộc')}
description: ${JSON.stringify(article.description)}
category: ${JSON.stringify(article.category || 'Tin tức')}
featuredImage: ${JSON.stringify(featuredImage)}
featured: false
tags: ${JSON.stringify(article.tags || [])}
---

${article.markdownBody}
`;

  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`✅ Đã xuất bản bài viết mới: ${filePath}`);
  return filePath;
}
