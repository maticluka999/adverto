import { Stack, StackContext, use } from '@serverless-stack/resources';
import {
  Mfa,
  UserPool,
  UserPoolOperation,
  VerificationEmailStyle,
} from 'aws-cdk-lib/aws-cognito';
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import constants from './constants';
import { Database } from './Database';

export function CognitoUserPool({ stack }: StackContext) {
  const userPool = new UserPool(stack, 'userPool', {
    userPoolName: `${stack.stage}-${constants.APP_NAME}-userPool`,
    selfSignUpEnabled: true,
    signInAliases: {
      email: true,
    },
    signInCaseSensitive: false,
    standardAttributes: {
      givenName: {
        required: true,
      },
      familyName: {
        required: true,
      },
    },
    userVerification: {
      emailStyle: VerificationEmailStyle.CODE,
    },
    passwordPolicy: {
      minLength: 8,
      requireLowercase: true,
      requireDigits: true,
      requireUppercase: true,
      requireSymbols: true,
    },
    mfa: Mfa.OPTIONAL,
    mfaSecondFactor: {
      sms: true,
      otp: false,
    },
  });

  userPool.addDomain('userPoolDomain', {
    cognitoDomain: {
      domainPrefix: `${stack.stage}-${constants.APP_NAME}`,
    },
  });

  addTriggers(stack, userPool);

  return userPool;
}

const addTriggers = (stack: Stack, userPool: UserPool) => {
  const db = use(Database);

  // post confirmation
  const postConfirmationTrigger = new NodejsFunction(
    stack,
    'postConfirmationTrigger',
    {
      runtime: Runtime.NODEJS_16_X,
      entry: 'services/triggers/post-confirmation-trigger.ts',
      environment: {
        REGION: stack.region,
        TABLE: db.tableName,
      },
    }
  );

  postConfirmationTrigger.role!.attachInlinePolicy(
    new Policy(stack, 'post-confirmation-trigger-policy', {
      statements: [
        new PolicyStatement({
          actions: ['cognito-idp:AdminUpdateUserAttributes'],
          effect: Effect.ALLOW,
          resources: [userPool.userPoolArn],
        }),
        new PolicyStatement({
          actions: ['dynamodb:PutItem'],
          effect: Effect.ALLOW,
          resources: [db.tableArn],
        }),
      ],
    })
  );

  userPool.addTrigger(
    UserPoolOperation.POST_CONFIRMATION,
    postConfirmationTrigger
  );
};
