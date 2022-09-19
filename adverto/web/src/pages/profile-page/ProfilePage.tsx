import { API } from 'aws-amplify';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Ads from '../../components/ads/Ads';
import PageNotFound from '../../components/PageNotFound';
import AuthContext from '../../context/auth-context';
import { Ad, AdvertiserDto } from '../../types';
import AdvertiserInfoSection from './UserInfoSection';

function ProfilePage() {
  const { sub } = useParams();
  const [pageNotFound, setPageNotFound] = useState(false);
  const [ads, setAds] = useState<Ad[]>();
  const [advertiser, setAdvertiser] = useState<AdvertiserDto>();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setAdvertiser(undefined);
    setAds(undefined);

    const fetchAdvertiser = async () => {
      try {
        const response = await API.get('api', `/users/${sub}`, {});
        setAdvertiser(response);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAds = async () => {
      const response = await API.get(
        'api',
        `/commercials?advertiserSub=${sub}`,
        {}
      );
      setAds(response);
    };

    fetchAdvertiser();
    fetchAds();
  }, [sub]);

  const onCreateUpdateAd = (ad: Ad) => {
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
          <AdvertiserInfoSection advertiser={advertiser} />
          <Ads
            ads={ads}
            onCreateUpdateAd={onCreateUpdateAd}
            onRemoveAd={onRemoveAd}
            hideCreateSection={user?.attributes.sub !== sub}
          />
        </>
      )}
    </div>
  );
}

export default ProfilePage;
