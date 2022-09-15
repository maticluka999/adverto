import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { useEffect, useState } from 'react';

function UsersPage() {
  const [users, setUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      // const provider = new CognitoIdentityServiceProvider();
      // const params = {};
      // const response = await provider.listUsersInGroup(params).promise();
    };

    fetchUsers();
  }, []);

  return <div className='flex flex-col'></div>;
}
