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
      'POST /ads': {
        authorizer: 'iam',
        function: 'functions/ads/create-ad.handler',
      },

      // get all ads
      'GET /ads': 'functions/ads/get-ads.handler',

      // get ads by advertiser id
      'GET /advertisers/{id}/ads': 'functions/ads/get-advertisers-ads.handler',

      // delete ad
      'DELETE /ads/{id}': {
        authorizer: 'iam',
        function: 'functions/ads/delete-ad.handler',
      },

      // admin delete ad
      'DELETE /admin-delete-ad': {
        authorizer: 'iam',
        function: 'functions/ads/admin-delete-ad.handler',
      },
    },
  });

  api.getFunction('GET /ads')?.addToRolePolicy(
    new PolicyStatement({
      actions: ['cognito-idp:ListUsers'],
      effect: Effect.ALLOW,
      resources: [userPool.userPoolArn],
    })
  );

  api;

  stack.addOutputs({
    API_URL: api.url,
  });

  return api;
}
