import LoadingSpinner from '../../components/LoadingSpinner';
import UserImage from '../../components/UserImage';
import { AdvertiserDto } from '../../types';

type Props = { user: AdvertiserDto };

const UserInfoSection = ({ user }: Props) => {
  return (
    <div>
      <div className='flex flex-col bg-gray-100 py-1 px-1 md:py-4 items-center'>
        {user ? (
          <div className='flex flex-row'>
            <div className='flex flex-col'>
              <UserImage src={user.profilePicture} width={100} height={100} />
            </div>
            <div className='w-full md:w-500px md:ml-20'>
              <p className='text-xl md:text-2xl text-center md:text-left mt-2 md:ml-2'>
                {`${user.givenName} ${user.familyName}`}
              </p>
              <div className='pl-1 text-center md:text-left'>
                <p className='text-sm break-words'>{user.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
};

export default UserInfoSection;
