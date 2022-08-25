import { StackContext, use } from '@serverless-stack/resources';
import {
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
} from 'aws-cdk-lib/aws-cognito';
import { ApiGateway } from './ApiGateway';
import { CognitoUserPool } from './CognitoUserPool';
import { CognitoUserPoolClient } from './CognitoUserPoolClient';
import constants from './constants';
import { generateUnauthenticatedRole } from './roles/generate-unauthenticated-role';

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

  const unauthenticatedRole = generateUnauthenticatedRole(stack, identityPool);

  new CfnIdentityPoolRoleAttachment(stack, 'identityPoolRoleAttachment', {
    identityPoolId: identityPool.ref,
    roles: {
      unauthenticated: unauthenticatedRole.roleArn,
    },
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
