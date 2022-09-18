import { StackContext, use } from '@serverless-stack/resources';
import {
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
} from 'aws-cdk-lib/aws-cognito';
import { CognitoUserPool } from './CognitoUserPool';
import { CognitoUserPoolClient } from './CognitoUserPoolClient';
import constants from './utils/constants';

export function CognitoIdentityPool({ stack }: StackContext) {
  const userPool = use(CognitoUserPool);
  const userPoolClient = use(CognitoUserPoolClient);

  const identityPool = new CfnIdentityPool(stack, 'identityPool', {
    identityPoolName: `${stack.stage}-${constants.APP_NAME}-identityPool`,
    allowUnauthenticatedIdentities: true,
    cognitoIdentityProviders: [
      {
        providerName: userPool.userPoolProviderName,
        clientId: userPoolClient.userPoolClientId,
      },
    ],
  });

  new CfnIdentityPoolRoleAttachment(stack, 'identityPoolRoleAttachment', {
    identityPoolId: identityPool.ref,
    roles: {},
    roleMappings: {
      mapping: {
        type: 'Token',
        ambiguousRoleResolution: 'Deny',
        identityProvider: `cognito-idp.${stack.region}.amazonaws.com/${userPool.userPoolId}:${userPoolClient.userPoolClientId}`,
      },
    },
  });

  return identityPool;
}
