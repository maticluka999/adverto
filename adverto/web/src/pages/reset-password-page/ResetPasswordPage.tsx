import { useState } from 'react';
import ErrorLabel from '../../components/ErrorLabel';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Auth } from 'aws-amplify';
import ResetPasswordForm from './ResetPasswordForm';
import { useLocation } from 'react-router-dom';

type State = {
  email: string;
  emailInputDisabled: boolean;
};

function ResetPasswordPage() {
  const location = useLocation();
  const { email, emailInputDisabled } = location.state as State;

  const [codeSent, setCodeSent] = useState(false);
  const [username, setUsername] = useState(email || '');
  const [errorText, setErrorText] = useState('');
  const [fetching, setFetching] = useState(false);

  const sendCode = async () => {
    if (!username) {
      setErrorText('Enter email.');
      return;
    }

    setFetching(true);

    try {
      const response = await Auth.forgotPassword(username);
      console.log(response);
      setErrorText('');
      setCodeSent(true);
    } catch (error: any) {
      switch (error.name) {
        case 'UserNotFoundException':
          setErrorText('User not found.');
          break;
        default:
          console.log(error);
          alert('Unknown error occurred.');
      }
    }

    setFetching(false);
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col items-center bg-white shadow-lg mt-28 p-5'>
        {!codeSent ? (
          <div className='flex flex-col items-center space-y-3'>
            <div>Send password reset code to:</div>
            <Input
              placeholder='email'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={emailInputDisabled}
            />
            {fetching ? (
              <LoadingSpinner />
            ) : (
              <button className='btnPrimary w-44' onClick={sendCode}>
                Send code
              </button>
            )}
            <ErrorLabel text={errorText} />
          </div>
        ) : (
          <ResetPasswordForm username={username} />
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
