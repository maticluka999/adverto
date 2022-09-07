import {
  ReactStaticSite,
  StackContext,
  use,
} from '@serverless-stack/resources';
import { ApiGateway } from './ApiGateway';
import { CognitoIdentityPool } from './CognitoIdentityPool';
import { CognitoUserPool } from './CognitoUserPool';
import { CognitoUserPoolClient } from './CognitoUserPoolClient';
import constants from './constants';
import { S3Bucket } from './S3Bucket';

export function Web({ stack }: StackContext) {
  const apiGateway = use(ApiGateway);
  const userPool = use(CognitoUserPool);
  const userPoolClient = use(CognitoUserPoolClient);
  const identityPool = use(CognitoIdentityPool);
  const bucket = use(S3Bucket);

  const site = new ReactStaticSite(stack, 'site', {
    path: 'web',
    buildCommand: 'npm run build',
    environment: {
      REACT_APP_API_URL: apiGateway.url,
      REACT_APP_AWS_REGION: stack.region,
      REACT_APP_USER_POOL_ID: userPool.userPoolId,
      REACT_APP_USER_POOL_DOMAIN: `${stack.stage}-${constants.APP_NAME}.auth.${stack.region}.amazoncognito.com`,
      REACT_APP_USER_POOL_CLIENT_ID: userPoolClient.userPoolClientId,
      REACT_APP_IDENTITY_POOL_ID: identityPool.ref,
      REACT_APP_S3_BUCKET_NAME: bucket.bucketName,
    },
  });

  stack.addOutputs({
    SITE_URL: site.url,
  });

  return site;
}
