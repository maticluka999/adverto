import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRef, useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorLabel from '../../components/ErrorLabel';
import Input from '../../components/Input';
import { ReactComponent as CheckCircle } from '../../assets/icons/check-circle.svg';
import { ReactComponent as ExclamationTriangle } from '../../assets/icons/exclamation-triangle.svg';
import { User } from '../../types';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import defaultProfilePicture from '../../assets/images/default-profile-picture.png';
import { S3Client } from '../../utils/aws/s3.utils';
import { getAWSCredentials } from '../../utils/aws/aws.utils';
import * as AWS from 'aws-sdk';
import { getFileExtension } from '../../utils/file.utils';

type Props = {
  user: User;
  setUser: (user: User) => void;
};

const validationSchema = yup.object({
  email: yup.string().email().required('Email is required'),
  givenName: yup.string().required('First name is required'),
  familyName: yup.string().required('Last name is required'),
  phoneNumber: yup.string(),
});

function PersonalInfoTab({ user, setUser }: Props) {
  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File>();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: user.attributes.email,
      givenName: user.attributes.givenName,
      familyName: user.attributes.familyName,
      phoneNumber: user.attributes.phoneNumber,
    },
  });

  const [updatingProfilePic, setUpdatingProfilePic] = useState(false);
  const [updatingInfo, setUpdatingInfo] = useState(false);
  const [errorText, setErrorText] = useState('');

  const onSubmit = async (data: Record<string, string>) => {
    setUpdatingInfo(true);

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

    setUpdatingInfo(false);
  };

  const fileInputHandler = () => {
    setFile(fileInput.current!.files![0]);
  };

  const openUploadFileModal = () => {
    fileInput.current?.click();
  };

  const updateProfilePic = async () => {
    setUpdatingProfilePic(true);

    const currentSession = await Auth.currentSession();
    const idToken = currentSession.getIdToken().getJwtToken();
    const credentials = await getAWSCredentials(idToken);
    const s3 = new S3Client(
      credentials!.accessKeyId,
      credentials!.secretAccessKey,
      credentials!.sessionToken!
    );
    // @ts-ignore
    const identityId = AWS.config.credentials._identityId;
    const key = `profile-pictures/${identityId}.${getFileExtension(file!)}`;

    let s3response;

    try {
      s3response = await s3.upload(file!, key);
      console.log(s3response);
    } catch (error) {
      console.log('asd');
      setUpdatingProfilePic(false);
      return;
    }

    const user = await Auth.currentAuthenticatedUser();

    try {
      const response = await Auth.updateUserAttributes(user, {
        picture: s3response.Location,
      });
      console.log(response);
    } catch (error: any) {
      switch (error.name) {
        default:
          alert('Unknown error occurred.');
      }
    }

    setFile(undefined);

    const u = user;
    u.attributes.picture = s3response.Location;
    setUser(u);

    setUpdatingProfilePic(false);
  };

  const removeProfilePic = async () => {
    setUpdatingProfilePic(true);

    const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();

    try {
      const response = await Auth.updateUserAttributes(
        currentAuthenticatedUser,
        {
          picture: '',
        }
      );
      console.log(response);
    } catch (error: any) {
      switch (error.name) {
        default:
          alert('Unknown error occurred.');
      }
    }

    setFile(undefined);

    const u = user;
    u.attributes.picture = '';
    setUser(u);

    setUpdatingProfilePic(false);
  };

  return (
    <div className='flex flex-col items-center text-lg bg-white rounded p-4 pt-2 md:p-8 md:pt-2'>
      <div className='flex justify-evenly items-center'>
        <div className='flex flex-col items-center'>
          <img
            src={
              (file && URL.createObjectURL(file)) ||
              user.attributes.picture ||
              defaultProfilePicture
            }
            alt='profile pic'
            className='w-28 h-28 rounded-full ring-2 ring-gray-300'
          />
          {!file && !updatingProfilePic && (
            <button
              className='mt-2 text-red-500 text-sm hover:underline'
              onClick={() => {
                removeProfilePic();
              }}
            >
              Remove
            </button>
          )}
        </div>
        {file ? (
          <button
            className='ml-8 text-blue-600 text-sm hover:underline'
            onClick={() => setFile(undefined)}
          >
            Cancel
          </button>
        ) : (
          <button
            className='ml-8 btnSecondary'
            onClick={() => {
              openUploadFileModal();
            }}
          >
            Upload
            <input
              type='file'
              accept='.png,.jpg,.jpeg'
              ref={fileInput}
              onInput={fileInputHandler}
              hidden
            />
          </button>
        )}
      </div>
      {updatingProfilePic ? (
        <div className='flex justify-center pt-3'>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {file && (
            <>
              <button className='mt-4 btnPrimary' onClick={updateProfilePic}>
                Update profile picture
              </button>
            </>
          )}
        </>
      )}
      {}
      <div className='w-full h-[1px] bg-gray-300 mt-5 mb-6'></div>
      <form
        className='flex flex-col items-center w-full'
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
          {user.attributes.phoneNumber &&
            (user.attributes.phoneNumberVerified ? (
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
                  className='text-blue-600 hover:underline self-end'
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/verify-phone-number', {
                      state: { phoneNumber: user.attributes.phoneNumber },
                    });
                  }}
                >
                  Click here to verify phone number
                </button>
              </>
            ))}
        </div>
        <div className='mt-2'>
          {updatingInfo ? (
            <div className='flex justify-center pt-3'>
              <LoadingSpinner />
            </div>
          ) : (
            <div className='flex flex-col items-center w-full'>
              <button className='btnPrimary my-2'>
                Update personal information
              </button>
              {errorText && <ErrorLabel text={errorText} />}
            </div>
          )}
        </div>
      </form>
      <div className='w-full h-[1px] bg-gray-300 mt-3'></div>
    </div>
  );
}

export default PersonalInfoTab;
