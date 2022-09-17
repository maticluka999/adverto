import { Amplify } from 'aws-amplify';
import { useEffect, useState } from 'react';
import awsAmplifyConfig from './config/aws-amplify.config';
import AuthContext from './context/auth-context';
import MyRouter from './MyRouter';
import { User } from './types';
import { getUser } from './utils/aws/aws.utils';

function App() {
  Amplify.configure(awsAmplifyConfig);

  const [user, setUser] = useState<User>();

  useEffect(() => {
    const loadUser = async () => {
      setUser(await getUser());
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user: user, setUser: setUser }}>
      <MyRouter />
    </AuthContext.Provider>
  );
}

export default App;
