import { Auth } from 'aws-amplify';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { useContext, useEffect, useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import AuthContext from '../../context/auth-context';
import { getAWSCredentials } from '../../utils/aws/aws.utils';
import UserItem from './UserItem';

export type UserDisplayData = {
  enabled: boolean;
  username: string;
  sub: string;
  email: string;
  givenName: string;
  familyName: string;
  picture?: string;
};

function cognitoUserToUserDto(
  user: CognitoIdentityServiceProvider.UserType
): UserDisplayData {
  console.log(user);
  return {
    enabled: user.Enabled!,
    username: user.Username!,
    sub: user.Attributes!.find((item) => item.Name === 'sub')!['Value']!,
    email: user.Attributes!.find((item) => item.Name === 'email')!['Value']!,
    givenName: user.Attributes!.find((item) => item.Name === 'given_name')![
      'Value'
    ]!,
    familyName: user.Attributes!.find((item) => item.Name === 'family_name')![
      'Value'
    ]!,
    picture: user.Attributes!.find((item) => item.Name === 'picture')?.[
      'Value'
    ],
  };
}

function AdminUsersPage() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState<UserDisplayData[]>();

  useEffect(() => {
    const fetchUsers = async () => {
      const currentSession = await Auth.currentSession();
      const idTokenJWT = currentSession.getIdToken().getJwtToken();
      const credentials = await getAWSCredentials(idTokenJWT);

      const provider = new CognitoIdentityServiceProvider({
        region: process.env.REACT_APP_AWS_REGION,
        credentials: credentials,
      });
      const params = {
        UserPoolId: process.env.REACT_APP_USER_POOL_ID!,
      };

      const response = await provider.listUsers(params).promise();
      console.log(response);
      const users = response.Users?.map((u) => cognitoUserToUserDto(u));
      setUsers(users?.filter((u) => u.sub !== user!.attributes.sub));
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  const updateUsersState = (username: string, enabled: boolean) => {
    const updatedUser = users!.find((user) => user.username === username)!;
    updatedUser.enabled = false;
    const updatedUsers = users!.map((user) => {
      return user.username === username ? updatedUser : user;
    });
    setUsers(updatedUsers);
  };

  return (
    <div className='flex flex-col flex-grow items-center'>
      <div className='flex flex-col items-center w-full md:w-[500px] py-10 px-2'>
        {users ? (
          users.map((user) => (
            <UserItem
              key={user.username}
              user={user}
              onBlock={(username) => updateUsersState(username, false)}
              onUnblock={(username) => updateUsersState(username, false)}
            />
          ))
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
}

export default AdminUsersPage;
