import { S3 } from 'aws-sdk';

export class S3Client {
  private s3: S3;

  constructor(
    accessKeyId: string,
    secretAccessKey: string,
    sessionToken: string
  ) {
    console.log(accessKeyId, secretAccessKey);
    this.s3 = new S3({ accessKeyId, secretAccessKey, sessionToken });
  }

  async upload(file: File, key: string): Promise<S3.ManagedUpload.SendData> {
    const params: S3.Types.PutObjectRequest = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME!,
      Key: key,
      Body: file,
    };

    return new Promise<S3.ManagedUpload.SendData>((resolve) => {
      this.s3.upload(params, (err: Error, data: S3.ManagedUpload.SendData) => {
        if (err) {
          console.log(err);
          throw new Error('Failed to upload the image.');
        }

        resolve(data);
      });
    });
  }

  async delete(key: string): Promise<S3.DeleteObjectOutput> {
    const params: S3.Types.DeleteObjectRequest = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME!,
      Key: key,
    };

    return new Promise<S3.DeleteObjectOutput>((resolve) => {
      this.s3.deleteObject(
        params,
        (err: Error, data: S3.DeleteObjectOutput) => {
          if (err) {
            console.log(err);
            throw new Error('Failed to delete the image.');
          }

          resolve(data);
        }
      );
    });
  }

  extractKeyFromObjectLocation = (objectLocation: string): string => {
    const parts = objectLocation.split('/');
    return parts[parts.length - 1];
  };
}
