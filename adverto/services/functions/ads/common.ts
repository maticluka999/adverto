import { S3 } from 'aws-sdk';
import { DeleteItemInput, DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Ad } from 'functions/utils/model';
import { deleteImage } from 'functions/utils/s3.utils';

export async function deleteAd(pk: string, sk: string) {
  const client = new DocumentClient();

  const params: DocumentClient.DeleteItemInput = {
    TableName: process.env.TABLE_NAME!,
    Key: { pk, sk },
    ReturnValues: 'ALL_OLD',
  };

  let ad;

  try {
    const response = await client.delete(params).promise();
    ad = { ...response.Attributes } as Ad;

    if (!ad) {
      return { statusCode: 400, body: 'No such ad.' };
    }
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: 'Failed to delete ad.' };
  }

  // delete ad image
  if (ad.imageUrl) {
    const extension = ad.imageUrl.split('.').at(-1)!;
    const key = `/ads/${pk}/${sk}.${extension}`;
    deleteImage(key);
  }

  return { statusCode: 204, body: 'Successfully deleted ad.' };
}

export function getAdImagePresignedPostData(
  imageContentType: string,
  advertiserSub: string,
  id: string
) {
  if (imageContentType) {
    const s3 = new S3({ region: process.env.REGION });

    const extension = imageContentType.split('/')[1];

    const presignedPostParams: S3.PresignedPost.Params = {
      Bucket: process.env.BUCKET_NAME,
      Fields: {
        key: `/ads/${advertiserSub}/${id}.${extension}`,
      },
      Conditions: [['eq', '$Content-Type', imageContentType]],
      Expires: 100,
    };

    return s3.createPresignedPost(presignedPostParams);
  }
}
