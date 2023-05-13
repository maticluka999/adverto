import {
  Context,
  PostConfirmationTriggerEvent,
  PostConfirmationTriggerHandler,
} from 'aws-lambda';
import * as aws from 'aws-sdk';

export const handler: PostConfirmationTriggerHandler = async (
  event: PostConfirmationTriggerEvent,
  context: Context
) => {
  console.log(event);

  try {
    const provider = new aws.CognitoIdentityServiceProvider({
      region: event.region,
    });

    const params = {
      GroupName: 'Advertisers',
      Username: event.userName,
      UserPoolId: event.userPoolId,
    };

    await provider.adminAddUserToGroup(params).promise();
  } catch (error: any) {
    console.log('error: ', error);
    return error;
  }

  return event;
};
