import { APIGatewayEvent } from 'aws-lambda';

export async function handler(event: APIGatewayEvent) {
  console.log(event);
  return { statusCode: 200, body: 'This is admin function' };
}
