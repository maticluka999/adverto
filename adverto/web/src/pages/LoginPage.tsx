import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

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

  return (
    <div className='bg-white h-screen'>
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
        <Link
          className='mb-3 text-blue-500 hover:underline'
          to='/forgot-password'
        >
          Forgot password?
        </Link>
        {fetching ? (
          <div className='mt-4'>
            <LoadingSpinner />
          </div>
        ) : (
          <div className='flex flex-col w-80 px-16 md:px-0 text-lg'>
            <p className='text-red-600 text-center text' hidden={!errorText}>
              {errorText}
            </p>
            <button className='btnPrimary my-2' onClick={logIn}>
              Log in
            </button>
            <Link className='btnSecondary text-center' to='/signup'>
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
