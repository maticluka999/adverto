import { StackContext, Api, use } from '@serverless-stack/resources';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { CognitoUserPool } from './CognitoUserPool';
import { Database } from './Database';
import { S3Bucket } from './S3Bucket';

export function ApiGateway({ stack }: StackContext) {
  const db = use(Database);
  const bucket = use(S3Bucket);
  const userPool = use(CognitoUserPool);

  const api = new Api(stack, 'api', {
    defaults: {
      authorizer: 'iam',
      function: {
        permissions: [db, bucket],
        environment: {
          REGION: stack.region,
          TABLE_NAME: db.tableName,
          BUCKET_NAME: bucket.bucketName,
          USER_POOL_ID: userPool.userPoolId,
        },
      },
    },
    routes: {
      // create ad
      'POST /commercials': 'functions/ads/create-ad.handler',

      // get all ads
      'GET /commercials': {
        function: 'functions/ads/get-ads.handler',
        authorizer: 'none',
      },

      // delete ad
      'DELETE /commercials/{id}': 'functions/ads/delete-ad.handler',

      // admin delete ad
      'DELETE /commercials/{id}/admin': 'functions/ads/delete-ad-admin.handler',

      // get user
      'GET /users/{sub}': {
        function: 'functions/users/get-user.handler',
        authorizer: 'none',
      },
    },
  });

  const listUsersStatement = new PolicyStatement({
    actions: ['cognito-idp:ListUsers'],
    effect: Effect.ALLOW,
    resources: [userPool.userPoolArn],
  });

  api.getFunction('GET /commercials')?.addToRolePolicy(listUsersStatement);
  api.getFunction('GET /users/{sub}')?.addToRolePolicy(listUsersStatement);

  return api;
}
