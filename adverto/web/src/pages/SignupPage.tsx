import ErrorLabel from '../components/ErrorLabel';
import Input from '../components/Input';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
  email: yup.string().email().required('Email is required'),
  // username: yup.string().required('Username is required'),
  givenName: yup.string().required('First name is required'),
  familyName: yup.string().required('Last name is required'),
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

function SignupPage() {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [fetching, setFetching] = useState(false);
  const [errorText, setErrorText] = useState('');

  const onSubmit = async (data: Record<string, string>) => {
    const params = {
      username: data.email,
      password: data.password,
      attributes: {
        given_name: data.givenName,
        family_name: data.familyName,
      },
    };

    // console.log(params);

    setFetching(true);

    try {
      const result = await Auth.signUp(params);
      console.log(result);
      navigate('/confirm-signup', {
        state: { username: params.username, password: params.password },
      });
    } catch (error) {
      console.log('error signing up:', error);
      alert('Unknown error ocurred');
    }

    setFetching(false);
  };

  return (
    <div className='flex flex-col items-center md:h-screen bg-gray-200'>
      <form
        className='flex flex-col items-center text-lg bg-white rounded my-3 lg:my-10 lg:mt-20 mx-3 p-8 shadow-lg md:w-500px'
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          {...register('email')}
          type='text'
          text='Email:'
          placeholder='email'
        />
        <ErrorLabel text={errors.email?.message} />
        {/* <Input
          {...register('username')}
          type='text'
          text='Username:'
          placeholder='username'
        />
        <ErrorLabel text={errors.username?.message} /> */}
        <Input
          type='text'
          text='First name:'
          placeholder='first name'
          {...register('givenName')}
        />
        <ErrorLabel text={errors.givenName?.message} />
        <Input
          type='text'
          text='Last name:'
          placeholder='last name'
          {...register('familyName')}
        />
        <ErrorLabel text={errors.familyName?.message} />
        <Input
          type='password'
          text='Password:'
          placeholder='password'
          {...register('password')}
        />
        <ErrorLabel text={errors.password?.message} />
        <Input
          type='password'
          text='Confirm password'
          placeholder='confirm password'
          {...register('confirm_password')}
        />
        <ErrorLabel text={errors.confirm_password?.message} />
        {fetching ? (
          <div className='flex justify-center pt-3'>
            <LoadingSpinner />
          </div>
        ) : (
          <div>
            <div className='flex my-2'>
              <button className='btnPrimary w-full'>Create account</button>
            </div>
            {errorText && <ErrorLabel text={errorText} />}
          </div>
        )}
      </form>
    </div>
  );
}

export default SignupPage;
