import {
  ReactStaticSite,
  StackContext,
  use,
} from '@serverless-stack/resources';
import { ApiGateway } from './ApiGateway';
import { CognitoUserPool } from './CognitoUserPool';
import { CognitoUserPoolClient } from './CognitoUserPoolClient';

export function Web({ stack }: StackContext) {
  const apiGateway = use(ApiGateway);
  const userPool = use(CognitoUserPool);
  const userPoolClient = use(CognitoUserPoolClient);

  const site = new ReactStaticSite(stack, 'site', {
    path: 'web',
    buildCommand: 'npm run build',
    environment: {
      REACT_APP_API_URL: apiGateway.url,
      REACT_APP_AWS_REGION: stack.region,
      REACT_APP_USER_POOL_ID: userPool.userPoolId,
      REACT_APP_USER_POOL_CLIENT_ID: userPoolClient.userPoolClientId,
    },
  });

  stack.addOutputs({
    SITE_URL: site.url,
  });

  return site;
}
