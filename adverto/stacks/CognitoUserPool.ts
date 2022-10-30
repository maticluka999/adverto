import { Function, Stack, StackContext } from '@serverless-stack/resources';
import {
  Mfa,
  UserPool,
  UserPoolOperation,
  VerificationEmailStyle,
} from 'aws-cdk-lib/aws-cognito';
import { Effect, Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import constants from './utils/constants';

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
      emailSubject: 'Adverto verification code',
      emailBody: 'Your Adverto verification code is {####}.',
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
    mfaMessage: 'Your Adverto code is {####}.',
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
  // post confirmation
  const postConfirmationTrigger = new Function(
    stack,
    'postConfirmationTrigger',
    {
      runtime: 'nodejs16.x',
      handler: 'functions/triggers/post-confirmation-trigger.handler',
    }
  );

  postConfirmationTrigger.role!.attachInlinePolicy(
    new Policy(stack, 'post-confirmation-trigger-policy', {
      statements: [
        new PolicyStatement({
          actions: ['cognito-idp:AdminAddUserToGroup'],
          effect: Effect.ALLOW,
          resources: [userPool.userPoolArn],
        }),
      ],
    })
  );

  userPool.addTrigger(
    UserPoolOperation.POST_CONFIRMATION,
    postConfirmationTrigger
  );
};
