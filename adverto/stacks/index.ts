import { ApiGateway } from './ApiGateway';
import { App } from '@serverless-stack/resources';
import { CognitoUserPool } from './CognitoUserPool';
import { CognitoUserPoolClient } from './CognitoUserPoolClient';

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: 'nodejs16.x',
    srcPath: 'services',
    bundle: {
      format: 'esm',
    },
  });
  app.stack(ApiGateway).stack(CognitoUserPool).stack(CognitoUserPoolClient);
}
