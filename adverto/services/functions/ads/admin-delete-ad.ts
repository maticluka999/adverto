import { APIGatewayEvent } from 'aws-lambda';
import { deleteAd } from './common';

export async function handler(event: APIGatewayEvent) {
  if (!event.queryStringParameters) {
    return { statusCode: 400, body: 'Invalid query params,' };
  }

  const { pk, sk } = event.queryStringParameters!;

  if (!pk || !sk) {
    return { statusCode: 400, body: 'Invalid query params,' };
  }

  return deleteAd(pk, sk);
}
