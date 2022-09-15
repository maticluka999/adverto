import { APIGatewayEvent } from 'aws-lambda';
import * as aws from 'aws-sdk';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { adToAdDto, cognitoUserToUserDto } from 'functions/utils/mappers';
import { Ad } from 'functions/utils/model';

// queries ads sorted by time of creation (gsi1sk = createdAt)
const allAdsQueryParams: aws.DynamoDB.DocumentClient.QueryInput = {
  TableName: process.env.TABLE_NAME!,
  IndexName: 'gsi1',
  KeyConditionExpression: 'gsi1pk = :gsi1pkValue and gsi1sk > :gsi1skValue',
  ExpressionAttributeValues: {
    ':gsi1pkValue': 'ad',
    ':gsi1skValue': 0,
  },
  ScanIndexForward: false,
};

// queries ads for specific advertiser sorted by time of creation (gsi1sk = createdAt)
function advertisersAdsQueryParams(
  advertiserSub: string
): aws.DynamoDB.DocumentClient.QueryInput {
  return {
    TableName: process.env.TABLE_NAME!,
    IndexName: 'gsi1',
    KeyConditionExpression: 'gsi1pk = :gsi1pkValue and gsi1sk > :gsi1skValue',
    FilterExpression: 'pk = :pkValue',
    ExpressionAttributeValues: {
      ':gsi1pkValue': 'ad',
      ':gsi1skValue': 0,
      ':pkValue': advertiserSub,
    },
    ScanIndexForward: false,
  };
}

export async function handler(event: APIGatewayEvent) {
  const advertiserSub = event.queryStringParameters?.advertiserSub;

  const queryParams = advertiserSub
    ? advertisersAdsQueryParams(advertiserSub)
    : allAdsQueryParams;

  const client = new aws.DynamoDB.DocumentClient();
  const adsDynamoResponse = await client.query(queryParams).promise();
  const ads = adsDynamoResponse.Items!;
  const advertisers = await getAdvertisersForAds(ads);

  const adDtos = ads.map((ad) => {
    const advertiser = advertisers.find((item) => item.sub === ad.pk)!;
    return adToAdDto(ad as Ad, advertiser);
  });

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(adDtos),
  };
}

async function getAdvertisersForAds(ads: any) {
  const subs = [...new Set(ads?.map((ad: any) => ad.pk))];

  const provider = new CognitoIdentityServiceProvider();

  const requests = subs.map((sub) => {
    var params = {
      Filter: `sub = "${sub}"`,
      UserPoolId: process.env.USER_POOL_ID!,
    };

    return provider.listUsers(params).promise();
  });

  const responses = await Promise.all(requests);

  const advertisers = responses.map((response) => {
    const user = response.Users![0]; // we only fetch one user (on index 0)
    return cognitoUserToUserDto(user);
  });

  return advertisers;
}
