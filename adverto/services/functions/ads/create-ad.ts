import { APIGatewayEvent } from 'aws-lambda';
import * as aws from 'aws-sdk';
import { S3 } from 'aws-sdk';
import { randomUUID } from 'crypto';
import { extractSubFromEvent } from 'functions/utils/auth.utils';
import { Ad } from 'functions/utils/model';
import { adToAdDto } from 'functions/utils/mappers';
import { adValidationSchema } from 'functions/utils/validationSchemas';
import { getAdImagePresignedPostData } from './common';

export async function handler(event: APIGatewayEvent) {
  const parsedBody = JSON.parse(event.body!);

  // validation
  try {
    await adValidationSchema.validate(parsedBody);
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ type: error.name, message: error.message }),
    };
  }

  const { title, text, price, imageContentType } = parsedBody;

  // presigned url
  const id = randomUUID();
  let presignedPostData = getAdImagePresignedPostData(
    imageContentType,
    extractSubFromEvent(event),
    id
  );

  // generate new ad
  const newAd = {
    pk: extractSubFromEvent(event),
    sk: id,
    gsi1pk: 'ad' as Ad['gsi1pk'],
    gsi1sk: Date.now(),
    title,
    text,
    price,
    imageUrl: presignedPostData
      ? `${presignedPostData!.url}/${presignedPostData!.fields.key}`
      : undefined,
  };

  // insert to db
  const client = new aws.DynamoDB.DocumentClient();
  const params: aws.DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.TABLE_NAME!,
    Item: {
      ...newAd,
    },
  };

  try {
    await client.put(params).promise();
  } catch (e: any) {
    console.log(e);
    return {
      statusCode: 500,
      body: 'An error occurred.',
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ad: adToAdDto(newAd),
      presignedPostData,
    }),
  };
}
