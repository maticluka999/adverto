import { Amplify } from 'aws-amplify';
import awsAmplifyConfig from './config/aws-amplify.config';
import MyRouter from './MyRouter';

function App() {
  Amplify.configure(awsAmplifyConfig);

  return <MyRouter />;
}

export default App;
