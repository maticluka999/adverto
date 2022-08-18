import { StackContext } from '@serverless-stack/resources';
import { Mfa, UserPool, VerificationEmailStyle } from 'aws-cdk-lib/aws-cognito';
import constants from './constants';

export function CognitoUserPool({ stack }: StackContext) {
  const userPool = new UserPool(stack, 'userPool', {
    userPoolName: `${stack.stage}-${constants.APP_NAME}-userPool`,
    selfSignUpEnabled: true,
    signInAliases: {
      email: true,
      username: true,
      preferredUsername: true,
    },
    standardAttributes: {
      givenName: {
        required: true,
      },
      familyName: {
        required: true,
      },
      preferredUsername: {
        required: true,
      },
      profilePicture: {},
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

  return userPool;
}
