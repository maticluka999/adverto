import { APIGatewayEvent } from 'aws-lambda';

export async function handler(event: APIGatewayEvent) {
  console.log(event.body);
  return { statusCode: 200, body: 'This is advertiser function' };
}
