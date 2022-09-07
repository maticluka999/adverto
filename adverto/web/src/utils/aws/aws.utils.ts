import { API, Auth, Signer } from 'aws-amplify';
import AWS from 'aws-sdk';
import { LoginsMap } from 'aws-sdk/clients/cognitoidentity';
import { CredentialsOptions } from 'aws-sdk/lib/credentials';
import { HttpMethod } from '../http-method.enum';

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

export async function executeSignedApi(
  method: HttpMethod,
  route: string,
  headers?: Record<string, string>
) {
  let idToken;

  try {
    idToken = (await Auth.currentSession()).getIdToken();
    console.log(idToken);
  } catch (err) {
    console.log(err);
  }

  await getAWSCredentials(idToken?.getJwtToken());

  const request = {
    method,
    url: `${process.env.REACT_APP_API_URL}${route}`,
    headers,
  };

  const access_info = {
    region: process.env.REACT_APP_AWS_REGION,
    // AWS service that is called (default: 'execute-api' -- AWS API Gateway)
    service: 'execute-api',
    access_key: AWS.config.credentials?.accessKeyId,
    secret_key: AWS.config.credentials?.secretAccessKey,
    session_token: AWS.config.credentials?.sessionToken,
  };

  const signedRequest = Signer.sign(request, access_info);

  switch (method) {
    case HttpMethod.GET:
      return API.get('api', route, signedRequest);
    case HttpMethod.POST:
      return API.post('api', route, signedRequest);
    case HttpMethod.PUT:
      return API.put('api', route, signedRequest);
    case HttpMethod.DELETE:
      return API.del('api', route, signedRequest);
    default:
      console.log('invalid http method');
  }
}
