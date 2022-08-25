import { Stack, use } from '@serverless-stack/resources';
import { CfnIdentityPool } from 'aws-cdk-lib/aws-cognito';
import {
  Role,
  WebIdentityPrincipal,
  PolicyStatement,
  Effect,
} from 'aws-cdk-lib/aws-iam';
import { ApiGateway } from '../ApiGateway';
import { generateExecuteApiRoot } from '../utils/utils';

export function generateUnauthenticatedRole(
  stack: Stack,
  identityPool: CfnIdentityPool
) {
  const unauthenticatedRole = new Role(stack, 'unauthenticatedRole', {
    assumedBy: new WebIdentityPrincipal('cognito-identity.amazonaws.com', {
      StringEquals: {
        'cognito-identity.amazonaws.com:aud': identityPool.ref,
      },
      'ForAnyValue:StringLike': {
        'cognito-identity.amazonaws.com:amr': 'unauthenticated',
      },
    }),
  });

  addPolicyStatements(stack, unauthenticatedRole);

  return unauthenticatedRole;
}

function addPolicyStatements(stack: Stack, unauthenticatedRole: Role) {
  const api = use(ApiGateway);
  const executeApiRoot = generateExecuteApiRoot(stack, api.httpApiId);

  unauthenticatedRole.addToPolicy(
    new PolicyStatement({
      actions: ['execute-api:Invoke'],
      effect: Effect.ALLOW,
      resources: [`${executeApiRoot}/GET/ads`],
    })
  );
}
