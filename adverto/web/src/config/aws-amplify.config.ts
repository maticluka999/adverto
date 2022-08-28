const awsAmplifyConfig = {
  Auth: {
    mandatorySignIn: true,
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
  },
  API: {
    endpoints: [
      {
        name: 'api',
        endpoint: process.env.REACT_APP_API_URL,
        region: process.env.REACT_APP_AWS_REGION,
      },
    ],
  },
  oauth: {
    domain: process.env.REACT_APP_USER_POOL_DOMAIN,
    redirectSignIn: generateRedirectSignIn(),
    redirectSignOut: generateRedirectSignOut(),
    responseType: 'token',
    scope: ['email', 'profile', 'openid'],
  },
};

function generateRedirectSignIn() {
  return window.location.origin;
}

function generateRedirectSignOut() {
  return window.location.origin + '/login';
}

export default awsAmplifyConfig;
