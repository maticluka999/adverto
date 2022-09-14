import { API } from 'aws-amplify';
import { useEffect, useState } from 'react';
import Ads from '../components/ads/Ads';
import { Ad } from '../types';
import { getAWSCredentials } from '../utils/aws/aws.utils';

function HomePage() {
  const [ads, setAds] = useState<Ad[]>();

  useEffect(() => {
    const fetchAds = async () => {
      const response = await API.get('api', '/ads', {});
      setAds(response);

      console.log(await getAWSCredentials());
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
    <div>
      <Ads ads={ads} onCreateAd={onCreateAd} onRemoveAd={onRemoveAd} />
    </div>
  );
}

export default HomePage;
