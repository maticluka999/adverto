import LoadingSpinner from '../../components/LoadingSpinner';
import UserImage from '../../components/UserImage';
import { AdvertiserDto } from '../../types';

type Props = { advertiser: AdvertiserDto };

const AdvertiserInfoSection = ({ advertiser }: Props) => {
  return (
    <div>
      <div className='flex flex-col bg-gray-100 py-1 px-1 md:py-4 items-center'>
        {advertiser ? (
          <div className='flex flex-row'>
            <div className='flex flex-col'>
              <UserImage src={advertiser.picture} width={100} height={100} />
            </div>
            <div className='w-full md:w-500px ml-5 md:ml-20'>
              <p className='text-xl md:text-2xl mt-2 '>
                {`${advertiser.givenName} ${advertiser.familyName}`}
              </p>
              <p className='text-sm break-words'>{advertiser.email}</p>
            </div>
          </div>
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </div>
  );
};

export default AdvertiserInfoSection;
