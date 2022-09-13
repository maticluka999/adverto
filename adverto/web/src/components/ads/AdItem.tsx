import { Link } from 'react-router-dom';
import { Ad } from '../../types';
import { dateTimeFormatOptions } from '../../utils/date-time-format-options';
import UserImage from '../UserImage';
import AdActionsButton from './AdActionsButton';

type Props = {
  ad: Ad;
  onRemoveAd: (adId: string) => void;
};

function AdItem({ ad, onRemoveAd }: Props) {
  const locale = 'en-US';

  return (
    <div className='bg-white mt-7 w-full rounded shadow-lg'>
      <div className='flex justify-between'>
        <div className='flex flex-row items-center'>
          <Link to={`/advertisers/${ad.advertiser.sub}`} className='m-2'>
            <UserImage src={ad.advertiser.picture} width={50} height={50} />
          </Link>
          <div>
            <Link
              to={`/advertisers/${ad.advertiser.sub}`}
              className='font-bold'
            >
              {`${ad.advertiser.givenName} ${ad.advertiser.familyName}`}
            </Link>
            <p className='text-xs text-gray-600'>
              {new Date(ad.createdAt).toLocaleString(
                locale,
                dateTimeFormatOptions
              )}
            </p>
          </div>
        </div>
        <div className='mt-4'>
          <AdActionsButton ad={ad} onRemoveAd={onRemoveAd} />
        </div>
      </div>
      {ad.imageUrl && <img src={ad.imageUrl} alt='' />}
      <div className='flex flex-col mt-2 mx-4'>
        <p className='text-lg font-medium'>{ad.title}</p>
        <p className='text-gray-600 text-sm'>{ad.text}</p>
        <p>
          <span className='font-medium mr-1'>Price:</span>
          <span className='text-gray-600 text-sm'>{ad.price}$</span>
        </p>
        <p>
          <span className='font-medium mr-1'>Email:</span>
          <span className='text-gray-600 text-sm'>{ad.advertiser.email}</span>
        </p>
      </div>
      <div></div>
      <div>
        <div className='flex flex-row items-center mb-1'>
          <div className='mt-1 ml-4 mr-2'></div>
        </div>
      </div>
    </div>
  );
}

export default AdItem;
