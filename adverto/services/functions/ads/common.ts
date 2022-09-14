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
