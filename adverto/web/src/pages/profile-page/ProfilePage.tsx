import { API } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Ads from '../../components/ads/Ads';
import PageNotFound from '../../components/PageNotFound';
import { Ad, AdvertiserDto } from '../../types';
import AdvertiserInfoSection from './UserInfoSection';

function ProfilePage() {
  const { sub } = useParams();
  const [pageNotFound, setPageNotFound] = useState(false);
  const [ads, setAds] = useState<Ad[]>();
  const [advertiser, setAdvertiser] = useState<AdvertiserDto>();

  useEffect(() => {
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
          {advertiser && <AdvertiserInfoSection advertiser={advertiser} />}
          <Ads ads={ads} onCreateAd={onCreateAd} onRemoveAd={onRemoveAd} />
        </>
      )}
    </div>
  );
}

export default ProfilePage;
