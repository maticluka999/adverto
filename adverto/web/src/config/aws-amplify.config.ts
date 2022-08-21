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
};

export default awsAmplifyConfig;
