import { Ad } from '../../types';
import AdItem from './AdItem';

type Props = {
  ads: Ad[];
  onRemoveAd: (adId: string) => void;
};

function AdList({ ads, onRemoveAd }: Props) {
  return (
    <div className='flex flex-col items-center w-full md:w-[630px] mb-20'>
      {ads.length > 0 ? (
        <>
          {ads.map((ad) => (
            <AdItem key={ad.id} ad={ad} onRemoveAd={onRemoveAd} />
          ))}
        </>
      ) : (
        <div className='flex flex-col items-center bg-gray-100 p-3 rounded-xl mt-10'>
          No ads found.
        </div>
      )}
    </div>
  );
}

export default AdList;
