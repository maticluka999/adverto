import { Auth } from 'aws-amplify';
import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorLabel from '../components/ErrorLabel';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import AuthContext from '../context/auth-context';
import { getUser } from '../utils/aws/aws.utils';

type Props = {
  mfaUser: any;
};

function SmsMfa({ mfaUser }: Props) {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [errorText, setErrorText] = useState('');
  const [fetching, setFetching] = useState(false);

  const confirm = async () => {
    setFetching(true);

    try {
      const response = await Auth.confirmSignIn(mfaUser, code);
      console.log(response);

      setUser(await getUser());
      navigate('/');
    } catch (error: any) {
      console.log('error during verification:', error);

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
        <div className='mb-7'>Two step authentication</div>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SmsMfa;
