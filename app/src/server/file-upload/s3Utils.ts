import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_IAM_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_S3_IAM_SECRET_KEY!,
  },
});

type S3Upload = {
  fileType: string;
  userInfo: string;
}

export const getUploadFileSignedURLFromS3 = async ({fileType, userInfo}: S3Upload) => {
  const ex = fileType.split('/')[1];
  const Key = `${userInfo}/${randomUUID()}.${ex}`;
  const s3Params = {
    Bucket: process.env.AWS_S3_FILES_BUCKET,
    Key,
    ContentType: `${fileType}`,
    ACL: 'public-read' as const, // Fix: Provide the correct type for ACL
  };
  const command = new PutObjectCommand(s3Params);
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  console.log('Generated Upload URL:', uploadUrl); // Debugging output
  console.log('Object Key:', Key); // Debugging output
  return { uploadUrl, key: Key };
}

export const getDownloadFileSignedURLFromS3 = async ({ key }: { key: string }) => {
  const s3Params = {
    Bucket: process.env.AWS_S3_FILES_BUCKET,
    Key: key,
  };
  const command = new GetObjectCommand(s3Params);
  const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  console.log('Generated Download URL:', downloadUrl); // Debugging output
  return downloadUrl;
}
