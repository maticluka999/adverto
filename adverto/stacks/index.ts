import { ApiGateway } from './ApiGateway';
import { App } from '@serverless-stack/resources';
import { CognitoUserPool } from './CognitoUserPool';
import { CognitoUserPoolClient } from './CognitoUserPoolClient';
import { Web } from './Web';
import { Database } from './Database';
import { CognitoIdentityPool } from './CognitoIdentityPool';
import { AdminRole } from './roles/AdminRole';
import { AdvertiserRole } from './roles/AdvertiserRole';
import { AdminsGroup } from './groups/AdminsGroup';
import { AdvertiserGroup } from './groups/AdvertisersGroup';
import { GoogleIdentityProvider } from './GoogleIdentityProvider';

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
    .stack(GoogleIdentityProvider)
    .stack(CognitoUserPoolClient)
    .stack(CognitoIdentityPool)
    .stack(AdminRole)
    .stack(AdminsGroup)
    .stack(AdvertiserRole)
    .stack(AdvertiserGroup)
    .stack(Web);
}
