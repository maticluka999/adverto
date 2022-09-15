import { APIGatewayEvent } from 'aws-lambda';
import { deleteAd } from './common';

export async function handler(event: APIGatewayEvent) {
  if (!event.queryStringParameters?.pk) {
    return { statusCode: 400, body: 'Invalid query params.' };
  }

  const pk = event.queryStringParameters!.pk;
  const sk = event.pathParameters!.id!;

  return deleteAd(pk, sk);
}
