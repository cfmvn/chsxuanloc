import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

// Đọc config từ process.env hoặc file .env
function getR2Config() {
  const env = process.env;
  let accountId = env.R2_ACCOUNT_ID;
  let accessKeyId = env.R2_ACCESS_KEY_ID;
  let secretAccessKey = env.R2_SECRET_ACCESS_KEY;
  let bucketName = env.R2_BUCKET_NAME || 'chsxuanloc';
  let publicDomain = env.R2_PUBLIC_DOMAIN || 'https://cdn.chsxuanloc.com';
  let endpoint = env.R2_ENDPOINT;

  if (!accessKeyId || !secretAccessKey) {
    try {
      const envPath = path.join(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const getVal = (k) => {
          const m = content.match(new RegExp(`^${k}=([^\\r\\n]+)`, 'm'));
          return m ? m[1].trim() : '';
        };
        accountId = accountId || getVal('R2_ACCOUNT_ID');
        accessKeyId = accessKeyId || getVal('R2_ACCESS_KEY_ID');
        secretAccessKey = secretAccessKey || getVal('R2_SECRET_ACCESS_KEY');
        bucketName = bucketName || getVal('R2_BUCKET_NAME') || 'chsxuanloc';
        publicDomain = publicDomain || getVal('R2_PUBLIC_DOMAIN') || 'https://cdn.chsxuanloc.com';
        endpoint = endpoint || getVal('R2_ENDPOINT');
      }
    } catch (e) {}
  }

  if (accountId && !endpoint) {
    endpoint = `https://${accountId}.r2.cloudflarestorage.com`;
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicDomain: publicDomain ? publicDomain.replace(/\/+$/, '') : '',
    endpoint
  };
}

let s3ClientInstance = null;

export function getR2Client() {
  if (s3ClientInstance) return s3ClientInstance;
  const config = getR2Config();

  if (!config.accessKeyId || !config.secretAccessKey || !config.endpoint) {
    return null;
  }

  s3ClientInstance = new S3Client({
    region: 'auto',
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    }
  });

  return s3ClientInstance;
}

/**
 * Upload buffer ảnh lên Cloudflare R2
 * @param {Buffer} buffer 
 * @param {string} r2Key Ví dụ: "posts/ten-bai-viet/anh-1.webp" hoặc "albums/ten-album/anh-1.webp"
 * @param {string} contentType Ví dụ: "image/webp"
 * @returns {Promise<string>} Trả về CDN Public URL (ví dụ: https://cdn.chsxuanloc.com/posts/ten-bai-viet/anh-1.webp)
 */
export async function uploadBufferToR2(buffer, r2Key, contentType = 'image/webp') {
  const client = getR2Client();
  const config = getR2Config();

  if (!client) {
    throw new Error('Chưa cấu hình thông tin kết nối Cloudflare R2!');
  }

  // Chuẩn hóa key (không bắt đầu bằng dấu /)
  const cleanKey = r2Key.replace(/^\/+/, '');

  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: cleanKey,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000, immutable'
  });

  await client.send(command);

  return `${config.publicDomain}/${cleanKey}`;
}

export { getR2Config };
