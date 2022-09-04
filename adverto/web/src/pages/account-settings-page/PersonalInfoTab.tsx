import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorLabel from '../../components/ErrorLabel';
import Input from '../../components/Input';
import { ReactComponent as CheckCircle } from '../../assets/icons/check-circle.svg';
import { ReactComponent as ExclamationTriangle } from '../../assets/icons/exclamation-triangle.svg';
import { UserAttributes } from '../../types';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

type Props = {
  userAttributes: UserAttributes;
};

const validationSchema = yup.object({
  email: yup.string().email().required('Email is required'),
  givenName: yup.string().required('First name is required'),
  familyName: yup.string().required('Last name is required'),
  phoneNumber: yup.string(),
});

function PersonalInfoTab({ userAttributes }: Props) {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: userAttributes.email,
      givenName: userAttributes.givenName,
      familyName: userAttributes.familyName,
      phoneNumber: userAttributes.phoneNumber,
    },
  });

  const [fetching, setFetching] = useState(false);
  const [errorText, setErrorText] = useState('');

  const onSubmit = async (data: Record<string, string>) => {
    setFetching(true);

    const user = await Auth.currentAuthenticatedUser();

    try {
      const response = await Auth.updateUserAttributes(user, {
        given_name: data.givenName,
        family_name: data.familyName,
        phone_number: data.phoneNumber,
      });
      console.log(response);
    } catch (error: any) {
      switch (error.name) {
        default:
          alert('Unknown error occurred.');
      }
    }

    setFetching(false);
  };

  return (
    <form
      className='flex flex-col items-center text-lg bg-white rounded p-4 pt-2 md:p-8 md:pt-2'
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        {...register('email')}
        type='text'
        text='Email:'
        placeholder='email'
        disabled
      />
      <ErrorLabel text={errors.email?.message} />
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
        type='text'
        text='Phone number:'
        placeholder='phone number'
        {...register('phoneNumber')}
      />
      <ErrorLabel text={errors.familyName?.message} />
      <div className='flex flex-col items-end text-sm self-end'>
        {userAttributes.phoneNumber &&
          (userAttributes.phoneNumberVerified ? (
            <div className='flex items-center'>
              <CheckCircle className='w-6 h-6 mr-1' />
              <div>Phone number verified</div>
            </div>
          ) : (
            <>
              <div className='flex items-center'>
                <ExclamationTriangle className='w-6 h-6 mr-1' />
                <div>Phone number not verified</div>
              </div>
              <button
                className='text-blue-500 hover:underline self-end'
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/verify-phone-number', {
                    state: { phoneNumber: userAttributes.phoneNumber },
                  });
                }}
              >
                Click here to verify phone number
              </button>
            </>
          ))}
      </div>
      <div className='mt-5'>
        {fetching ? (
          <div className='flex justify-center pt-3'>
            <LoadingSpinner />
          </div>
        ) : (
          <div>
            <button className='btnPrimary my-2 mb-7'>
              Update personal information
            </button>
            {errorText && <ErrorLabel text={errorText} />}
          </div>
        )}
      </div>
    </form>
  );
}

export default PersonalInfoTab;
