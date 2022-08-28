import { StackContext, use } from '@serverless-stack/resources';
import {
  ProviderAttribute,
  UserPoolIdentityProviderGoogle,
} from 'aws-cdk-lib/aws-cognito';
import { CognitoUserPool } from './CognitoUserPool';
import constants from './constants';

export function GoogleIdentityProvider({ stack }: StackContext) {
  const userPool = use(CognitoUserPool);

  const googleIDP = new UserPoolIdentityProviderGoogle(stack, 'googleIDP', {
    userPool,
    clientId: constants.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: constants.GOOGLE_OAUTH_CLIENT_SECRET,
    // Email scope is required, because the default is 'profile' and that doesn't allow Cognito
    // to fetch the user's email from his Google account after the user does an SSO with Google
    scopes: ['email', 'profile', 'openid'],
    // Map fields from the user's Google profile to Cognito user fields, when the user is auto-provisioned
    attributeMapping: {
      givenName: ProviderAttribute.GOOGLE_GIVEN_NAME,
      familyName: ProviderAttribute.GOOGLE_FAMILY_NAME,
      email: ProviderAttribute.GOOGLE_EMAIL,
    },
  });

  return googleIDP;
}
