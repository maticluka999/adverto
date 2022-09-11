import { useState } from 'react';
import AdList from '../../components/ads/AdList';
import Ads from '../../components/ads/Ads';
import CreateAdSection from '../../components/ads/CreateAdSection';
import { testAds } from '../../components/ads/test-ads';
import LoadingSpinner from '../../components/LoadingSpinner';
import PageNotFound from '../../components/PageNotFound';
import { Ad } from '../../types';
import UserInfoSection from './UserInfoSection';

function ProfilePage() {
  const [ads, setAds] = useState<Ad[]>(testAds);
  const [pageNotFound, setPageNotFound] = useState(false);

  const onCreateAd = (ad: Ad) => {
    setAds([ad, ...ads!]);
  };

  const onRemoveAd = (adId: string) => {
    setAds(ads!.filter((ad) => ad.id !== adId));
  };

  return (
    <div className='flex flex-col flex-grow'>
      {pageNotFound ? (
        <PageNotFound />
      ) : (
        <>
          {ads && (
            <>
              <UserInfoSection user={ads[0].user} />
              <Ads ads={ads} onCreateAd={onCreateAd} onRemoveAd={onRemoveAd} />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ProfilePage;
