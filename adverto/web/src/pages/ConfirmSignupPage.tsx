import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ErrorLabel from '../components/ErrorLabel';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';

type State = {
  username: string;
  password: string;
};

function ConfirmSignupPage() {
  const location = useLocation();
  const { username, password } = location.state as State;

  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [errorText, setErrorText] = useState('');
  const [fetching, setFetching] = useState(false);

  const resend = async () => {
    setFetching(true);

    try {
      const response = await Auth.resendSignUp(username);
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    setFetching(false);
  };

  const confirm = async () => {
    setFetching(true);

    try {
      const confirmResponse = await Auth.confirmSignUp(username, code);
      console.log(confirmResponse);

      const signInResponse = await Auth.signIn(username, password);
      console.log(signInResponse);

      navigate('/');
    } catch (error: any) {
      console.log(error);

      switch (error.name) {
        case 'CodeMismatchException':
          setErrorText('Invalid verification code provided.');
          break;
        default:
          alert('Unknown error occurred');
      }
    }

    setFetching(false);
  };

  return (
    <div className='flex flex-col items-center'>
      <div className='flex flex-col items-center bg-white shadow-lg mt-28 p-5'>
        <div>Verification code has been sent to:</div>
        <div className='mb-9'>{username}</div>
        <Input
          text='Enter verification code:'
          placeholder=''
          onChange={(e) => setCode(e.target.value)}
        />
        <ErrorLabel text={errorText} />
        <div className='flex items-center justify-center h-20'>
          {fetching ? (
            <LoadingSpinner />
          ) : (
            <div className='flex flex-col items-center justify-center'>
              <button className='btnPrimary w-32' onClick={confirm}>
                Confirm
              </button>
              <button className='mt-3 text-blue-500' onClick={resend}>
                Resend verification code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConfirmSignupPage;
