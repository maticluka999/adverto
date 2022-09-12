import { useState } from 'react';
import ErrorLabel from '../../components/ErrorLabel';
import Input from '../../components/Input';
import LoadingSpinner from '../../components/LoadingSpinner';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Auth } from 'aws-amplify';
import { Link } from 'react-router-dom';

type Props = {
  username: string;
};

const validationSchema = yup.object({
  code: yup.string().required('Password reset code is required'),
  password: yup
    .string()
    .required('Password is required')
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Password must contain at least 8 characters, one uppercase, one number and one special case character'
    ),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

function ResetPasswordForm({ username }: Props) {
  const [errorText, setErrorText] = useState('');
  const [fetching, setFetching] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: Record<string, string>) => {
    setFetching(true);

    try {
      const response = await Auth.forgotPasswordSubmit(
        username,
        data.code,
        data.password
      );
      console.log(response);
      setErrorText('');
      setResetComplete(true);
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

  const resend = () => {
    console.log('res');
  };

  return (
    <div>
      {resetComplete ? (
        <div className='flex flex-col space-y-3'>
          <div>Password reset completed successfuly.</div>
          <Link className='btnPrimary text-center' to='/login'>
            Log in
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col items-center'
        >
          <div>Password reset code has been sent to:</div>
          <div className='mb-9'>{username}</div>
          <Input
            text='Password reset code:'
            placeholder='code'
            {...register('code')}
          />
          <ErrorLabel text={errors.code?.message} />
          <Input
            type='password'
            text='New password:'
            placeholder='new password'
            {...register('password')}
          />
          <ErrorLabel text={errors.password?.message} />
          <Input
            type='password'
            text='Confirm new password:'
            placeholder='confirm new password'
            {...register('confirm_password')}
          />
          <ErrorLabel text={errors.confirm_password?.message} />
          <ErrorLabel text={errorText} />
          <div className='flex items-center justify-center h-20'>
            {fetching ? (
              <LoadingSpinner />
            ) : (
              <div className='flex flex-col items-center justify-center'>
                <button className='btnPrimary w-44'>Reset password</button>
                <button
                  className='mt-3 text-blue-600 hover:underline'
                  onClick={(e) => {
                    e.preventDefault();
                    resend();
                  }}
                >
                  Resend password reset code
                </button>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}

export default ResetPasswordForm;
