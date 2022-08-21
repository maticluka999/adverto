import {
  Context,
  PostConfirmationTriggerEvent,
  PostConfirmationTriggerHandler,
} from 'aws-lambda';
import * as aws from 'aws-sdk';
import { Advertiser } from '../model';

export const handler: PostConfirmationTriggerHandler = async (
  event: PostConfirmationTriggerEvent,
  context: Context,
  callback
) => {
  console.log(event);

  try {
    const advertiser: Advertiser = {
      pk: event.userName,
      sk: 'info',
      familyName: event.request.userAttributes['family_name'],
      givenName: event.request.userAttributes['given_name'],
      email: event.request.userAttributes['email'],
    };
    await createAdvertiser(advertiser);
  } catch (error) {
    console.log('error: ', error);
    callback(error, event);
  }

  callback(null, event);
};

const createAdvertiser = async (advertiser: Advertiser) => {
  const client = new aws.DynamoDB.DocumentClient();

  const params = {
    TableName: process.env.TABLE!,
    Item: advertiser,
  };

  await client.put(params).promise();
};
