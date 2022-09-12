import { StackContext, Api, use } from '@serverless-stack/resources';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { CognitoUserPool } from './CognitoUserPool';
import { Database } from './Database';

export function ApiGateway({ stack }: StackContext) {
  const db = use(Database);
  const userPool = use(CognitoUserPool);

  const api = new Api(stack, 'api', {
    defaults: {
      authorizer: 'iam',
      function: {
        permissions: [db],
        environment: {
          TABLE_NAME: db.tableName,
          USER_POOL_ID: userPool.userPoolId,
        },
      },
    },
    routes: {
      'POST /ads': 'functions/create-ad.handler',
      'GET /ads': 'functions/get-ads.handler',
      'GET /advertiser/{id}/ads': 'functions/get-advertisers-ads.handler',
      'GET /admin-function': 'functions/some-admin-function.handler',
      'GET /advertiser-function': 'functions/some-advertiser-function.handler',
    },
  });

  api.getFunction('GET /ads')?.addToRolePolicy(
    new PolicyStatement({
      actions: ['cognito-idp:ListUsers'],
      effect: Effect.ALLOW,
      resources: [userPool.userPoolArn],
    })
  );

  stack.addOutputs({
    API_URL: api.url,
  });

  return api;
}
