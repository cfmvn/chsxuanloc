import fs from 'fs';
import path from 'path';
import { transformFacebookPostToArticle, saveArticleToMarkdown } from './facebookAiPipeline.js';

const SYNC_LOG_PATH = path.join(process.cwd(), 'src', 'data', 'facebook_sync_log.json');

function getSyncLog() {
  if (fs.existsSync(SYNC_LOG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(SYNC_LOG_PATH, 'utf8'));
    } catch (e) {}
  }
  return { lastSync: null, syncedPostIds: [] };
}

function saveSyncLog(log) {
  const dir = path.dirname(SYNC_LOG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SYNC_LOG_PATH, JSON.stringify(log, null, 2), 'utf8');
}

/**
 * Xử lý một mảng bài đăng từ Fanpage (qua webhook/RSS/API/Puppeteer)
 * và tự động viết lại thành bài báo Markdown qua Groq AI
 */
export async function processFacebookPosts(posts = []) {
  const log = getSyncLog();
  const results = [];

  for (const post of posts) {
    if (log.syncedPostIds.includes(post.id)) {
      console.log(`⏩ Bỏ qua bài viết đã đồng bộ: ${post.id}`);
      continue;
    }

    console.log(`🤖 Đang xử lý bài viết [${post.id}] qua AI Groq...`);
    try {
      const article = await transformFacebookPostToArticle(post);
      const savedPath = saveArticleToMarkdown(article, post.featuredImage || '/assets/images/default-post.jpg');
      
      log.syncedPostIds.push(post.id);
      results.push({ id: post.id, status: 'success', article, path: savedPath });
    } catch (err) {
      console.error(`❌ Lỗi xử lý bài viết [${post.id}]:`, err.message);
      results.push({ id: post.id, status: 'error', error: err.message });
    }
  }

  log.lastSync = new Date().toISOString();
  saveSyncLog(log);
  return results;
}
