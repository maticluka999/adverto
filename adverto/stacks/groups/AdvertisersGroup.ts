import { StackContext, use } from '@serverless-stack/resources';
import { CfnUserPoolGroup } from 'aws-cdk-lib/aws-cognito';
import { CognitoUserPool } from '../CognitoUserPool';
import { AdvertiserRole } from '../roles/AdvertiserRole';

export function AdvertiserGroup({ stack }: StackContext) {
  const userPool = use(CognitoUserPool);
  const role = use(AdvertiserRole);

  const advertisersGroup = new CfnUserPoolGroup(stack, 'advertisersGroup', {
    userPoolId: userPool.userPoolId,
    groupName: 'Advertisers',
    precedence: 1,
    roleArn: role.roleArn,
  });

  return advertisersGroup;
}
