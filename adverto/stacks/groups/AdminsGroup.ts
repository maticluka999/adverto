import { StackContext, use } from '@serverless-stack/resources';
import { CfnUserPoolGroup } from 'aws-cdk-lib/aws-cognito';
import { CognitoUserPool } from '../CognitoUserPool';
import { AdminRole } from '../roles/AdminRole';

export function AdminsGroup({ stack }: StackContext) {
  const userPool = use(CognitoUserPool);
  const role = use(AdminRole);

  const adminsGroup = new CfnUserPoolGroup(stack, 'adminsGroup', {
    userPoolId: userPool.userPoolId,
    groupName: 'Admins',
    precedence: 0,
    roleArn: role.roleArn,
  });

  return adminsGroup;
}
