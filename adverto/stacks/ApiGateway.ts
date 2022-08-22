import { StackContext, Api, use } from '@serverless-stack/resources';
import { Database } from './Database';

export function ApiGateway({ stack }: StackContext) {
  const db = use(Database);

  const api = new Api(stack, 'api', {
    defaults: {
      function: {
        permissions: [db],
        environment: {
          TABLE_NAME: db.tableName,
        },
      },
    },
    routes: {
      'GET /': 'functions/lambda.handler',
      'GET /ads': 'functions/get-ads.handler',
      'GET /advertiser/{id}/ads': 'functions/get-advertisers-ads.handler',
      'GET /admin-function': 'functions/some-admin-function.handler',
      'GET /advertiser-function': 'functions/some-advertiser-function.handler',
    },
  });

  stack.addOutputs({
    API_URL: api.url,
  });

  return api;
}
