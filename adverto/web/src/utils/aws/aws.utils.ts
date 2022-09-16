import { Auth } from 'aws-amplify';
import AWS from 'aws-sdk';
import { LoginsMap } from 'aws-sdk/clients/cognitoidentity';
import { CredentialsOptions } from 'aws-sdk/lib/credentials';
import { PreferredMFA, User, UserRole } from '../../types';

const cognitoIdentityProvider = `cognito-idp.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${process.env.REACT_APP_USER_POOL_ID}`;

export async function getAWSCredentials(idTokenJwt?: string) {
  const logins: LoginsMap = {};

  if (idTokenJwt) {
    logins[cognitoIdentityProvider] = idTokenJwt;
  }

  AWS.config.region = process.env.REACT_APP_AWS_REGION!;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID!,
    Logins: logins,
  });

  return new Promise<AWS.Credentials | CredentialsOptions | null>(
    (resolve, reject) => {
      AWS.config.getCredentials(
        async (
          err: AWS.AWSError | null,
          credentials: AWS.Credentials | CredentialsOptions | null
        ) => {
          if (err) {
            console.log(err);
            reject(err);
          }

          resolve(credentials);
        }
      );
    }
  );
}

export async function getUser(): Promise<User> {
  const currentSession = await Auth.currentSession();
  const idToken = currentSession.getIdToken();
  const idTokenPayload = idToken.payload;

  const attributes = {
    sub: idTokenPayload.sub,
    email: idTokenPayload.email,
    givenName: idTokenPayload.given_name,
    familyName: idTokenPayload.family_name,
    phoneNumber: idTokenPayload.phone_number,
    phoneNumberVerified: idTokenPayload.phone_number_verified,
    picture: idTokenPayload.picture,
  };

  const preferredMFA =
    PreferredMFA[idTokenPayload.preferredMFA as keyof typeof PreferredMFA];

  const roles: UserRole[] = [];

  idToken.payload['cognito:roles'].forEach((role: string) => {
    if (role.includes('admin')) {
      roles.push(UserRole.ADMIN);
    }

    if (role.includes('advertiser')) {
      roles.push(UserRole.ADVERTISER);
    }
  });

  return {
    attributes,
    preferredMFA,
    roles,
  };
}
