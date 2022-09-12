import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { ReactComponent as GoogleIcon } from '../assets/icons/google.svg';

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [fetching, setFetching] = useState(false);

  const usernameChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUsername(event.target.value);
  };

  const passwordChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
  };

  const logIn = async () => {
    setFetching(true);

    try {
      const response = await Auth.signIn(username, password);
      console.log(response);
      navigate('/');
    } catch (error: any) {
      switch (error.name) {
        case 'NotAuthorizedException':
          setErrorText('Invalid credentials.');
          break;
        case 'UserNotFoundException':
          setErrorText('Invalid credentials.');
          break;
        case 'UserNotConfirmedException':
          navigate(`/confirm-signup/${username}`);
          break;
        default:
          alert('Unknown error occurred.');
      }
    }

    setFetching(false);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      logIn();
    }
  };

  const googleSignIn = () => {
    Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
  };

  return (
    <div className='h-screen'>
      <h1 className='text-blue-600 text-4xl text-center font-bold pt-20 mb-8'>
        Welcome to Adverto
      </h1>
      <div className='flex flex-col items-center'>
        <div className='flex flex-col w-72 mb-3'>
          <input
            className='input p-1 mb-2 md:text-lg'
            type='text'
            placeholder='email'
            name='email'
            onChange={usernameChangeHandler}
            onKeyDown={onInputKeyDown}
          />
          <input
            className='input p-1 md:text-lg'
            type='password'
            placeholder='password'
            onChange={passwordChangeHandler}
            onKeyDown={onInputKeyDown}
          />
        </div>
        {!fetching && (
          <Link
            className='mb-3 text-blue-600 hover:underline'
            to='/reset-password'
            state={{ email: '', emailInputDisabled: false }}
          >
            Forgot password?
          </Link>
        )}
        {fetching ? (
          <div className='mt-4'>
            <LoadingSpinner />
          </div>
        ) : (
          <div className='flex flex-col w-80 px-3 md:px-0 text-lg'>
            <p className='text-red-600 text-center text' hidden={!errorText}>
              {errorText}
            </p>
            <button className='btnPrimary my-2' onClick={logIn}>
              Log in
            </button>
            <Link className='btnSecondary text-center' to='/signup'>
              Sign up
            </Link>
            <button
              className='self-center flex items-center mt-5 bg-white shadow-lg p-3'
              onClick={googleSignIn}
            >
              <div className='w-6 h-6 mr-3'>
                <GoogleIcon />
              </div>
              <div className='font-bold opacity-50 text-sm md:text-base'>
                Sign in with Google
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
