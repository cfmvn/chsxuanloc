import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getR2Client, getR2Config } from '../src/services/r2Storage.js';

/**
 * Script tự động ping / truy cập các file trên Cloudflare R2
 * - Liệt kê tất cả file/object trong bucket R2
 * - Gửi HTTP GET/HEAD request (hoặc qua domain CDN) để làm ấm cache và duy trì trạng thái active
 */
async function warmUpR2Files() {
  const client = getR2Client();
  const config = getR2Config();

  if (!client) {
    console.error('❌ Chưa cấu hình thông tin kết nối Cloudflare R2 trong .env!');
    process.exit(1);
  }

  console.log(`🚀 Bắt đầu quét và ping file trong bucket: "${config.bucketName}"...`);
  console.log(`🌐 CDN Public Domain: ${config.publicDomain || 'Chưa cấu hình'}\n`);

  let continuationToken = undefined;
  let totalObjects = 0;
  let successCount = 0;
  let errorCount = 0;

  try {
    do {
      const listCommand = new ListObjectsV2Command({
        Bucket: config.bucketName,
        ContinuationToken: continuationToken,
        MaxKeys: 100
      });

      const response = await client.send(listCommand);
      const contents = response.Contents || [];

      for (const item of contents) {
        totalObjects++;
        const fileKey = item.Key;
        const fileUrl = config.publicDomain 
          ? `${config.publicDomain}/${fileKey}` 
          : `${config.endpoint}/${config.bucketName}/${fileKey}`;

        try {
          // Gửi request HEAD/GET để ping file mà không tốn nhiều băng thông
          const res = await fetch(fileUrl, { method: 'GET' });
          if (res.ok) {
            successCount++;
            console.log(`✅ [${totalObjects}] Ping thành công: ${fileKey} (${(item.Size / 1024).toFixed(1)} KB) - HTTP ${res.status}`);
          } else {
            errorCount++;
            console.warn(`⚠️ [${totalObjects}] HTTP ${res.status}: ${fileUrl}`);
          }
        } catch (err) {
          errorCount++;
          console.error(`❌ [${totalObjects}] Lỗi ping ${fileKey}:`, err.message);
        }
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    console.log(`\n========================================`);
    console.log(`🎉 Hoàn tất duy trì truy cập file R2!`);
    console.log(`📊 Tổng số file: ${totalObjects}`);
    console.log(`✅ Thành công: ${successCount}`);
    console.log(`❌ Thất bại: ${errorCount}`);
    console.log(`========================================\n`);
  } catch (error) {
    console.error('❌ Lỗi khi thực thi script:', error);
  }
}

warmUpR2Files();
