import { S3 } from 'aws-sdk';

export function deleteImage(key: string) {
  const s3 = new S3({ region: process.env.REGION });

  const params: S3.DeleteObjectRequest = {
    Bucket: process.env.BUCKET_NAME!,
    Key: key,
  };

  return s3.deleteObject(params).promise();
}
