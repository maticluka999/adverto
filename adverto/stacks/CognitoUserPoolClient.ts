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
      callbackUrls: ['http://localhost:3000'], // DEPLOY_IMPORTANT: this must be set to proper value via console once deployed
      logoutUrls: ['http://localhost:3000/login'], // DEPLOY_IMPORTANT: this must be set to proper value via console once deployed
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
