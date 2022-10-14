import { Auth, Signer } from 'aws-amplify';
import AWS from 'aws-sdk';
import { LoginsMap } from 'aws-sdk/clients/cognitoidentity';
import { CredentialsOptions } from 'aws-sdk/lib/credentials';
import { User, RoleName, Role } from '../../types';
import { HttpMethod } from '../http-method.enum';

const cognitoIdentityProvider = `cognito-idp.${process.env.REACT_APP_AWS_REGION}.amazonaws.com/${process.env.REACT_APP_USER_POOL_ID}`;

export async function getAWSCredentials(
  idTokenJwt?: string,
  customRoleArn?: string
) {
  const logins: LoginsMap = {};

  if (idTokenJwt) {
    logins[cognitoIdentityProvider] = idTokenJwt;
  }

  AWS.config.region = process.env.REACT_APP_AWS_REGION!;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID!,
    Logins: logins,
    CustomRoleArn: customRoleArn,
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

type ExecuteApiInit = {
  customRoleArn?: string;
  headers?: Record<string, string>;
  data?: any;
};

export async function executeApi(
  method: HttpMethod,
  route: string,
  init?: ExecuteApiInit
) {
  let idToken;

  try {
    idToken = (await Auth.currentSession()).getIdToken();
  } catch (err) {
    console.log(err);
  }

  await getAWSCredentials(idToken?.getJwtToken(), init?.customRoleArn);

  const request = {
    method,
    url: `${process.env.REACT_APP_API_URL}${route}`,
    headers: init?.headers,
    data: JSON.stringify(init?.data),
  };

  const access_info = {
    access_key: AWS.config.credentials?.accessKeyId,
    secret_key: AWS.config.credentials?.secretAccessKey,
    session_token: AWS.config.credentials?.sessionToken,
  };

  // Note: this is optional
  const service_info = {
    region: process.env.REACT_APP_AWS_REGION,
    // AWS service that is called (default: 'execute-api' -- AWS API Gateway)
    service: 'execute-api',
  };

  // visit Signer class definition to understand params better
  const signedRequest = Signer.sign(request, access_info, service_info);

  const response = await fetch(signedRequest.url, {
    method: signedRequest.method,
    headers: signedRequest.headers,
    body: signedRequest.data,
  });

  return response;
}

export async function getUser(bypassCache?: boolean): Promise<User> {
  const currentUser = await Auth.currentAuthenticatedUser({
    bypassCache: Boolean(bypassCache),
  });
  const idTokenPayload = currentUser.signInUserSession.idToken.payload;

  console.log('idToken:', currentUser.signInUserSession);
  console.log('idTokenPayload:', idTokenPayload);

  const attributes = {
    sub: idTokenPayload.sub,
    email: idTokenPayload.email,
    givenName: idTokenPayload.given_name,
    familyName: idTokenPayload.family_name,
    phoneNumber: idTokenPayload.phone_number,
    phoneNumberVerified: idTokenPayload.phone_number_verified,
    picture: idTokenPayload.picture,
  };

  const roles: Role[] = [];

  idTokenPayload['cognito:roles'].forEach((role: string) => {
    if (role.includes('admin')) {
      roles.push({ name: RoleName.ADMIN, arn: role });
    }

    if (role.includes('advertiser')) {
      roles.push({ name: RoleName.ADVERTISER, arn: role });
    }
  });

  return new User(attributes, roles);
}
