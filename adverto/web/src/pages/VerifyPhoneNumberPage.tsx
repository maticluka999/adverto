import { Auth } from 'aws-amplify';
import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorLabel from '../components/ErrorLabel';
import Input from '../components/Input';
import LoadingSpinner from '../components/LoadingSpinner';
import AuthContext from '../context/auth-context';
import { getUser } from '../utils/aws/aws.utils';

type State = {
  phoneNumber: string;
};

function VerifyPhoneNumberPage() {
  const location = useLocation();
  const { phoneNumber } = location.state as State;
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [fetching, setFetching] = useState(false);
  const [errorText, setErrorText] = useState('');

  const sendCode = async () => {
    setFetching(true);

    try {
      const response = await Auth.verifyCurrentUserAttribute('phone_number');
      console.log(response);
      setErrorText('');
      setCodeSent(true);
    } catch (error: any) {
      switch (error.name) {
        default:
          console.log(error);
          alert('Unknown error occurred.');
      }
    }

    setFetching(false);
  };

  const verify = async () => {
    setFetching(true);

    try {
      const response = await Auth.verifyCurrentUserAttributeSubmit(
        'phone_number',
        code
      );
      console.log(response);

      setErrorText('');

      setUser(await getUser());
      navigate('/account-settings');
    } catch (error: any) {
      switch (error.name) {
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
            <div>Send verification code to:</div>
            <Input value={phoneNumber} disabled />
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
          <div className='flex flex-col items-center'>
            <div>Verification code has been sent to:</div>
            <div className='mb-9'>{phoneNumber}</div>
            <Input
              text='Verification code:'
              placeholder='code'
              onChange={(e) => setCode(e.target.value)}
            />
            <ErrorLabel text={errorText} />
            <div className='flex items-center justify-center h-20'>
              {fetching ? (
                <LoadingSpinner />
              ) : (
                <div className='flex flex-col items-center justify-center'>
                  <button className='btnPrimary w-44' onClick={verify}>
                    Verify
                  </button>
                  <button
                    className='mt-3 text-blue-600 hover:underline'
                    onClick={(e) => {
                      e.preventDefault();
                      sendCode();
                    }}
                  >
                    Resend verification code
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyPhoneNumberPage;
