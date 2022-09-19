import { useContext } from 'react';
import AuthContext from '../../context/auth-context';
import { Ad } from '../../types';
import LoadingSpinner from '../LoadingSpinner';
import AdList from './AdList';
import CreateAdSection from './CreateAdSection';

type Props = {
  ads?: Ad[];
  onCreateUpdateAd: (ad: Ad) => void;
  onRemoveAd: (adId: string) => void;
  hideCreateSection?: boolean;
};

function Ads({ ads, onCreateUpdateAd, onRemoveAd, hideCreateSection }: Props) {
  const { user } = useContext(AuthContext);

  return (
    <div className='flex flex-col w-full items-center px-2'>
      {ads ? (
        <>
          {!hideCreateSection && user && (
            <CreateAdSection onCreateUpdateAd={onCreateUpdateAd} />
          )}
          <AdList ads={ads} onRemoveAd={onRemoveAd} />
        </>
      ) : (
        <div className='flex justify-center mt-14'>
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}

export default Ads;
