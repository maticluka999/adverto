import { Auth } from 'aws-amplify';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import Switch from '../../components/Switch';
import AuthContext from '../../context/auth-context';
import { PreferredMFA } from '../../types';
import { getUser } from '../../utils/aws/aws.utils';
import { ReactComponent as InformationCircle } from './../../assets/icons/information-circle.svg';

function SecurityTab() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(false);
  const [preferredMFA, setPreferredMFA] = useState<string>();

  useEffect(() => {
    const loadPreferredMFA = async () => {
      const response = await Auth.getPreferredMFA(
        await Auth.currentAuthenticatedUser(),
        { bypassCache: true }
      );
      console.log(response);
      setPreferredMFA(response);
    };

    loadPreferredMFA();
  }, []);

  const handleMFAChange = async (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const preferredMfa = e.currentTarget.checked ? 'SMS_MFA' : 'NOMFA';
    setFetching(true);

    try {
      const response = await Auth.setPreferredMFA(
        await Auth.currentAuthenticatedUser(),
        preferredMfa
      );
      console.log(response);
      setPreferredMFA(preferredMfa);
    } catch (error) {
      console.log('error setting user mfa pref:', error);
    }

    setFetching(false);
  };

  return (
    <div className='flex flex-col items-center w-full text-lg bg-white rounded p-8 pt-2'>
      <div className='w-full h-[1px] bg-gray-300 mb-5'></div>
      <div className='w-full mb-2'>Two factor authentication:</div>
      {!preferredMFA || fetching ? (
        <LoadingSpinner />
      ) : (
        <Switch
          text='SMS two factor authentication'
          disabled={!user!.attributes.phoneNumberVerified || fetching}
          defaultChecked={preferredMFA === PreferredMFA.SMS}
          onClick={(e) => handleMFAChange(e)}
        />
      )}
      <div className='flex items-center self-end text-sm mt-1'>
        <InformationCircle className='w-6 h-6 mr-1' />
        <div>Requires verified phone number</div>
      </div>
      <div className='w-full h-[1px] bg-gray-300 my-5'></div>
      <div className='flex flex-wrap w-full'>
        <div>Password reset:</div>
        <button
          className='ml-4 pt-0 text-blue-600 hover:underline'
          onClick={() => {
            console.log(user!.attributes.email);
            navigate('/reset-password', {
              state: {
                email: user!.attributes.email,
                emailInputDisabled: true,
              },
            });
          }}
        >
          Click here to reset
        </button>
        <div className='w-full h-[1px] bg-gray-300 my-5'></div>
      </div>
    </div>
  );
}

export default SecurityTab;
