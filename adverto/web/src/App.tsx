import { Amplify } from 'aws-amplify';
import awsAmplifyConfig from './config/aws-amplify.config';
import MyRouter from './MyRouter';

function App() {
  console.log(process.env.REACT_APP_API_URL);
  Amplify.configure(awsAmplifyConfig);

  return <MyRouter />;
}

export default App;
