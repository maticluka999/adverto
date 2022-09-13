import { Stack, StackContext, use } from '@serverless-stack/resources';
import {
  Effect,
  PolicyStatement,
  Role,
  WebIdentityPrincipal,
} from 'aws-cdk-lib/aws-iam';
import { ApiGateway } from '../ApiGateway';
import { CognitoIdentityPool } from '../CognitoIdentityPool';
import { S3Bucket } from '../S3Bucket';
import { generateExecuteApiRoot } from '../utils/utils';

export function AdvertiserRole({ stack }: StackContext) {
  const identityPool = use(CognitoIdentityPool);

  const advertiserRole = new Role(stack, 'advertiserRole', {
    assumedBy: new WebIdentityPrincipal('cognito-identity.amazonaws.com', {
      StringEquals: {
        'cognito-identity.amazonaws.com:aud': identityPool.ref,
      },
      'ForAnyValue:StringLike': {
        'cognito-identity.amazonaws.com:amr': 'authenticated',
      },
    }),
  });

  addPolicyStatements(stack, advertiserRole);

  return advertiserRole;
}

function addPolicyStatements(stack: Stack, advertiserRole: Role) {
  const api = use(ApiGateway);
  const executeApiRoot = generateExecuteApiRoot(stack, api.httpApiId);

  advertiserRole.addToPolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['execute-api:Invoke'],
      resources: [
        `${executeApiRoot}/POST/ads`,
        `${executeApiRoot}/PUT/ads`,
        `${executeApiRoot}/DELETE/ads/*`,
      ],
    })
  );

  const bucket = use(S3Bucket);
  const principalsFolder = `${bucket.bucketArn}/\${cognito-identity.amazonaws.com:sub}`;

  advertiserRole.addToPolicy(
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['s3:PutObject'],
      resources: [
        `${principalsFolder}/profile_picture.png`,
        `${principalsFolder}/profile_picture.jpg`,
        `${principalsFolder}/profile_picture.jpeg`,
      ],
    })
  );
}
