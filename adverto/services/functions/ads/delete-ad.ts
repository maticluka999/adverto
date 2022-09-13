import { APIGatewayEvent } from 'aws-lambda';
import * as aws from 'aws-sdk';
import { S3 } from 'aws-sdk';
import {
  extractIdentityIdFromEvent,
  extractSubFromEvent,
} from 'functions/utils/auth.utils';
import { Ad } from 'functions/utils/model';

export async function handler(event: APIGatewayEvent) {
  const client = new aws.DynamoDB.DocumentClient();

  const params: aws.DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: process.env.TABLE_NAME!,
    Key: {
      pk: extractSubFromEvent(event),
      sk: event.pathParameters!.id!,
    },
    ReturnValues: 'ALL_OLD',
  };

  let ad;

  try {
    const response = await client.delete(params).promise();
    ad = { ...response.Attributes } as Ad;

    if (!ad) {
      return { statusCode: 400, body: 'You do not own such ad.' };
    }
  } catch (error) {
    console.log(error);
    return { statusCode: 500, body: 'Failed to delete ad.' };
  }

  // delete ad image
  if (ad.imageUrl) {
    const advertiserIdentityId = extractIdentityIdFromEvent(event);
    const extension = ad.imageUrl.split('.').at(-1)!;
    const key = `${advertiserIdentityId}/ads/${ad.sk}.${extension}`;
    deleteImage(key);
  }

  return { statusCode: 204, body: 'Successfully deleted ad.' };
}

function deleteImage(key: string) {
  const s3 = new S3({ region: process.env.REGION });

  const params: S3.DeleteObjectRequest = {
    Bucket: process.env.BUCKET_NAME!,
    Key: key,
  };

  s3.deleteObject(params).promise();
}
