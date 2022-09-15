import { APIGatewayEvent } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { extractSubFromEvent } from 'functions/utils/auth.utils';
import { adToAdDto } from 'functions/utils/mappers';
import { Ad } from 'functions/utils/model';
import { adValidationSchema } from 'functions/utils/validationSchemas';
import { getAdImagePresignedPostData } from './common';

export async function handler(event: APIGatewayEvent) {
  const parsedBody = JSON.parse(event.body!);

  const id = parsedBody.id;

  if (!id) {
    return {
      statusCode: 400,
      body: 'Id is required.',
    };
  }

  // validation
  try {
    await adValidationSchema.validate(parsedBody);
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ type: error.name, message: error.message }),
    };
  }

  const { title, text, price, imageContentType, imageUrl } = parsedBody;

  // presigned url
  let presignedPostData = getAdImagePresignedPostData(
    imageContentType,
    extractSubFromEvent(event),
    id
  );

  // generate update data
  const updateData = {
    pk: extractSubFromEvent(event),
    sk: id,
    gsi1pk: 'ad' as Ad['gsi1pk'],
    gsi1sk: Date.now(),
    title,
    text,
    price,
    imageUrl: presignedPostData
      ? `${presignedPostData!.url}/${presignedPostData!.fields.key}`
      : imageUrl,
  };

  // replace existing ad
  const client = new DocumentClient();
  const params: DocumentClient.PutItemInput = {
    TableName: process.env.TABLE_NAME!,
    Item: {
      ...updateData,
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
      ad: adToAdDto(updateData),
      presignedPostData,
    }),
  };
}
