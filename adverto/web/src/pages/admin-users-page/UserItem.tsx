import { Auth } from 'aws-amplify';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { AdminDisableUserRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getAWSCredentials } from '../../utils/aws/aws.utils';
import { UserDisplayData } from './AdminUsersPage';

type Props = {
  user: UserDisplayData;
  onBlock: (username: string) => void;
  onUnblock: (username: string) => void;
};

function UserItem({ user, onBlock, onUnblock }: Props) {
  const [fetching, setFetching] = useState(false);

  const blockUser = async (username: string) => {
    setFetching(true);

    const currentSession = await Auth.currentSession();
    const idTokenJWT = currentSession.getIdToken().getJwtToken();
    const credentials = await getAWSCredentials(idTokenJWT);

    const provider = new CognitoIdentityServiceProvider({
      region: process.env.REACT_APP_AWS_REGION,
      credentials: credentials,
    });
    const params: AdminDisableUserRequest = {
      UserPoolId: process.env.REACT_APP_USER_POOL_ID!,
      Username: username,
    };

    const response = await provider.adminDisableUser(params).promise();
    console.log(response);

    onBlock(username);

    setFetching(false);
  };

  const unblockUser = async (username: string) => {
    setFetching(true);

    const currentSession = await Auth.currentSession();
    const idTokenJWT = currentSession.getIdToken().getJwtToken();
    const credentials = await getAWSCredentials(idTokenJWT);

    const provider = new CognitoIdentityServiceProvider({
      region: process.env.REACT_APP_AWS_REGION,
      credentials: credentials,
    });
    const params: AdminDisableUserRequest = {
      UserPoolId: process.env.REACT_APP_USER_POOL_ID!,
      Username: username,
    };

    const response = await provider.adminEnableUser(params).promise();
    console.log(response);

    onUnblock(username);

    setFetching(false);
  };

  return (
    <div className='flex items-center w-full justify-between p-4 bg-white rounded-md shadow-lg mb-3'>
      <div className='flex flex-col'>
        <div>{`${user.givenName} ${user.familyName}`}</div>
        <div>{user.email}</div>
      </div>
      <div className='flex flex-col w-24'>
        {fetching ? (
          <div className='flex justify-center'>
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {user.enabled ? (
              <button
                className='btnPrimary'
                onClick={() => {
                  blockUser(user.username);
                }}
              >
                Block
              </button>
            ) : (
              <button
                className='btnSecondary'
                onClick={() => {
                  unblockUser(user.username);
                }}
              >
                Unblock
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UserItem;
