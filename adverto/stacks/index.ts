import { ApiGateway } from './ApiGateway';
import { App } from '@serverless-stack/resources';
import { CognitoUserPool } from './CognitoUserPool';
import { CognitoUserPoolClient } from './CognitoUserPoolClient';
import { Web } from './Web';
import { Database } from './Database';

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: 'nodejs16.x',
    srcPath: 'services',
    bundle: {
      format: 'esm',
    },
  });
  app
    .stack(Database)
    .stack(ApiGateway)
    .stack(CognitoUserPool)
    .stack(CognitoUserPoolClient)
    .stack(Web);
}
