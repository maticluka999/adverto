import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import * as aws from 'aws-sdk';
import { CognitoIdentityServiceProvider } from 'aws-sdk';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const client = new aws.DynamoDB.DocumentClient();

  const params: aws.DynamoDB.DocumentClient.QueryInput = {
    TableName: process.env.TABLE_NAME!,
    IndexName: 'gsi1',
    KeyConditionExpression: 'gsi1pk = :gsi1pkValue and gsi1sk > :gsi1skValue',
    ExpressionAttributeValues: {
      ':gsi1pkValue': 'ad',
      ':gsi1skValue': 0,
    },
    ScanIndexForward: false,
  };

  const response = await client.query(params).promise();
  const ads = response.Items;

  const subs = [...new Set(ads?.map((ad) => ad.pk))];

  const provider = new CognitoIdentityServiceProvider();

  const requests = subs.map((sub) => {
    var filter = 'sub = "' + sub + '"';
    var req = {
      Filter: filter,
      UserPoolId: process.env.USER_POOL_ID!, // looks like us-east-9_KDFn1cvys
    };

    return provider.listUsers(req).promise();
  });

  const resp = await Promise.all(requests);
  const advertisers = resp.map((item) => {
    const user = item.Users![0];
    return {
      sub: user.Attributes!.find((item) => item.Name === 'sub')!['Value'],
      email: user.Attributes!.find((item) => item.Name === 'email')!['Value'],
      givenName: user.Attributes!.find((item) => item.Name === 'given_name')![
        'Value'
      ],
      familyName: user.Attributes!.find((item) => item.Name === 'family_name')![
        'Value'
      ],
      picture: user.Attributes!.find((item) => item.Name === 'picture')![
        'Value'
      ],
    };
  });

  const adDtos = ads!.map((ad) => {
    const a = {
      id: ad.sk,
      title: ad.title,
      text: ad.text,
      price: ad.price,
      createdAt: ad.gsi1sk,
      imageUrl: ad.imageUrl,
      advertiser: advertisers.find((item) => item.sub === ad.pk),
    };

    return a;
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(adDtos),
  };
};
