import { APIGatewayEvent, APIGatewayProxyHandlerV2 } from 'aws-lambda';
import * as aws from 'aws-sdk';
import { Authorizer } from 'aws-sdk/clients/apigatewayv2';
import { randomUUID } from 'crypto';

function extractSubFromEvent(event: APIGatewayEvent) {
  const authorizer = event.requestContext.authorizer!;
  return authorizer.iam.cognitoIdentity.amr[2].split('CognitoSignIn:')[1];
}

export const handler = async (event: APIGatewayEvent) => {
  const advertiserSub = extractSubFromEvent(event);
  const client = new aws.DynamoDB.DocumentClient();

  const { title, text, price } = JSON.parse(event.body!);

  const params: aws.DynamoDB.DocumentClient.PutItemInput = {
    TableName: process.env.TABLE_NAME!,
    Item: {
      pk: advertiserSub,
      sk: randomUUID(),
      gsi1pk: 'ad',
      gsi1sk: Date.now(),
      title,
      text,
      price,
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
    body: JSON.stringify(params.Item),
  };
};
