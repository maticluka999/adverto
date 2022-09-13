import { APIGatewayEvent } from 'aws-lambda';

export async function handler(event: APIGatewayEvent) {
  return { statusCode: 204 };
}
