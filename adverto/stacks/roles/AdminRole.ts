import { Stack, StackContext, use } from '@serverless-stack/resources';
import {
  Effect,
  PolicyStatement,
  Role,
  WebIdentityPrincipal,
} from 'aws-cdk-lib/aws-iam';
import { ApiGateway } from '../ApiGateway';
import { CognitoIdentityPool } from '../CognitoIdentityPool';
import { CognitoUserPool } from '../CognitoUserPool';
import { generateExecuteApiRoot } from '../utils/utils';

export function AdminRole({ stack }: StackContext) {
  const identityPool = use(CognitoIdentityPool);

  const adminRole = new Role(stack, 'adminRole', {
    assumedBy: new WebIdentityPrincipal('cognito-identity.amazonaws.com', {
      StringEquals: {
        'cognito-identity.amazonaws.com:aud': identityPool.ref,
      },
      'ForAnyValue:StringLike': {
        'cognito-identity.amazonaws.com:amr': 'authenticated',
      },
    }),
  });

  addPolicyStatements(stack, adminRole);

  return adminRole;
}

function addPolicyStatements(stack: Stack, adminRole: Role) {
  const api = use(ApiGateway);
  const executeApiRoot = generateExecuteApiRoot(stack, api.httpApiId);

  adminRole.addToPolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['execute-api:Invoke'],
      resources: [
        `${executeApiRoot}/POST/commercials`,
        `${executeApiRoot}/PUT/commercials`,
        `${executeApiRoot}/DELETE/commercials/*`,
        `${executeApiRoot}/DELETE/commercials/*/admin`,
      ],
    })
  );

  const userPool = use(CognitoUserPool);

  adminRole.addToPolicy(
    new PolicyStatement({
      actions: [
        'cognito-idp:ListUsers',
        'cognito-idp:AdminDisableUser',
        'cognito-idp:AdminEnableUser',
      ],
      effect: Effect.ALLOW,
      resources: [userPool.userPoolArn],
    })
  );
}
