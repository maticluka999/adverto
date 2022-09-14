import { APIGatewayEvent } from 'aws-lambda';
import { extractSubFromEvent } from 'functions/utils/auth.utils';
import { deleteAd } from './common';

export async function handler(event: APIGatewayEvent) {
  const pk = extractSubFromEvent(event);
  const sk = event.pathParameters!.id!;
  return deleteAd(pk, sk);
}
