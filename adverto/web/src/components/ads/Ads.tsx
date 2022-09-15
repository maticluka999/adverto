import { useContext } from 'react';
import AuthContext from '../../context/auth-context';
import { Ad } from '../../types';
import LoadingSpinner from '../LoadingSpinner';
import AdList from './AdList';
import CreateAdSection from './CreateAdSection';

type Props = {
  ads?: Ad[];
  onCreateAd: (ad: Ad) => void;
  onRemoveAd: (adId: string) => void;
};

function Ads({ ads, onCreateAd, onRemoveAd }: Props) {
  const { user } = useContext(AuthContext);

  return (
    <div className='flex flex-col w-full items-center px-2'>
      {ads ? (
        <>
          {user && <CreateAdSection onCreateAd={onCreateAd} />}
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
