import { APIGatewayEvent } from 'aws-lambda';

export function extractIdentityIdFromEvent(event: APIGatewayEvent) {
  const authorizer = event.requestContext.authorizer!;
  return authorizer.iam.cognitoIdentity.identityId;
}

export function extractSubFromEvent(event: APIGatewayEvent) {
  const authorizer = event.requestContext.authorizer!;
  return authorizer.iam.cognitoIdentity.amr[2].split('CognitoSignIn:')[1];
}
