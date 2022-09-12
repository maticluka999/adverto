import { Link } from 'react-router-dom';
import { Ad, AdvertiserDto } from '../../types';
import AdItem from './AdItem';

type Props = {
  ads: Ad[];
  onRemoveAd: (adId: string) => void;
};

function AdList({ ads, onRemoveAd }: Props) {
  return (
    <div className='flex flex-col items-center w-full md:w-[630px]'>
      {ads.length > 0 ? (
        <div className='flex flex-col items-center flex-grow'>
          {ads.map((ad) => (
            <AdItem
              key={ad.id}
              ad={ad}
              advertiser={ad.advertiser}
              onRemoveAd={onRemoveAd}
            />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center bg-gray-100 p-3 rounded-xl mt-10'>
          No ads found.
        </div>
      )}
    </div>
  );
}

export default AdList;
