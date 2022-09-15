import { API } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Ads from '../../components/ads/Ads';
import PageNotFound from '../../components/PageNotFound';
import { Ad } from '../../types';
import UserInfoSection from './UserInfoSection';

function ProfilePage() {
  const { sub } = useParams();
  const [pageNotFound, setPageNotFound] = useState(false);
  const [ads, setAds] = useState<Ad[]>();

  useEffect(() => {
    const fetchAds = async () => {
      const response = await API.get(
        'api',
        `/commercials?advertiserSub=${sub}`,
        {}
      );
      setAds(response);
    };

    fetchAds();
  }, []);

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
          {ads && <UserInfoSection user={ads[0].advertiser} />}
          <Ads ads={ads} onCreateAd={onCreateAd} onRemoveAd={onRemoveAd} />
        </>
      )}
    </div>
  );
}

export default ProfilePage;
