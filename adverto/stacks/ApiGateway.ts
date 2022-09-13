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
        function: 'functions/create-ad.handler',
      },

      // get all ads
      'GET /ads': 'functions/get-ads.handler',

      // get ads by advertiser id
      'GET /advertiser/{id}/ads': 'functions/get-advertisers-ads.handler',

      // admin function
      'GET /admin-function': {
        authorizer: 'iam',
        function: 'functions/some-admin-function.handler',
      },

      // advertiser funcion
      'GET /advertiser-function': {
        authorizer: 'iam',
        function: 'functions/some-advertiser-function.handler',
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
