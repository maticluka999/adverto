import { StackContext, use } from '@serverless-stack/resources';
import {
  ClientAttributes,
  UserPoolClient,
  UserPoolClientIdentityProvider,
} from 'aws-cdk-lib/aws-cognito';
import { CognitoUserPool } from './CognitoUserPool';
import constants from './constants';
import standardCognitoAttributes from './utils/standard-cognito-attributes';

export function CognitoUserPoolClient({ stack }: StackContext) {
  const userPool = use(CognitoUserPool);

  const userPoolClient = new UserPoolClient(stack, 'userPoolClient', {
    userPoolClientName: `${stack.stage}-${constants.APP_NAME}-userPoolClient`,
    userPool: userPool,
    supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
    readAttributes: generateReadAttributes(),
    writeAttributes: generateWriteAttributes(),
  });

  return userPoolClient;
}

const generateReadAttributes = () => {
  return new ClientAttributes().withStandardAttributes(
    standardCognitoAttributes
  );
};

const generateWriteAttributes = () => {
  return new ClientAttributes().withStandardAttributes(
    standardCognitoAttributes
  );
};
