import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import * as aws from 'aws-sdk';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const advertiserId = event.pathParameters!.id;
  const client = new aws.DynamoDB.DocumentClient();

  const params: aws.DynamoDB.DocumentClient.QueryInput = {
    TableName: process.env.TABLE_NAME!,
    KeyConditionExpression: 'pk = :pkValue and begins_with(sk, :skValue)',
    ExpressionAttributeValues: {
      ':pkValue': advertiserId,
      ':skValue': 'ad',
    },
    ScanIndexForward: false,
  };

  const response = await client.query(params).promise();

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response.Items),
  };
};
