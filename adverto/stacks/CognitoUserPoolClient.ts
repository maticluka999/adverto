import { StackContext, use } from '@serverless-stack/resources';
import {
  ClientAttributes,
  UserPoolClient,
  UserPoolClientIdentityProvider,
} from 'aws-cdk-lib/aws-cognito';
import { CognitoUserPool } from './CognitoUserPool';
import constants from './constants';
import standardCognitoReadAttributes from './utils/standard-cognito-read-attributes';
import standardCognitoWriteAttributes from './utils/standard-cognito-write-attributes';

export function CognitoUserPoolClient({ stack }: StackContext) {
  const userPool = use(CognitoUserPool);

  const userPoolClient = new UserPoolClient(stack, 'userPoolClient', {
    userPoolClientName: `${stack.stage}-${constants.APP_NAME}-userPoolClient`,
    userPool,
    supportedIdentityProviders: [
      UserPoolClientIdentityProvider.COGNITO,
      UserPoolClientIdentityProvider.GOOGLE,
    ],
    readAttributes: generateReadAttributes(),
    writeAttributes: generateWriteAttributes(),
    oAuth: {
      callbackUrls: [
        stack.stage.startsWith('local')
          ? 'http://localhost:3000'
          : process.env.SITE_URL!,
      ], // DEPLOY_IMPORTANT: set env SITE_URL var
      logoutUrls: [
        stack.stage.startsWith('local')
          ? 'http://localhost:3000/login'
          : `${process.env.SITE_URL!}/login`,
      ], // DEPLOY_IMPORTANT: set env SITE_URL var
    },
  });

  return userPoolClient;
}

function generateReadAttributes() {
  return new ClientAttributes().withStandardAttributes(
    standardCognitoReadAttributes
  );
}

function generateWriteAttributes() {
  return new ClientAttributes().withStandardAttributes(
    standardCognitoWriteAttributes
  );
}
