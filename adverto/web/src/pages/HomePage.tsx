import { API } from 'aws-amplify';
import { useEffect, useState } from 'react';
import Ads from '../components/ads/Ads';
import { Ad } from '../types';

function HomePage() {
  const [ads, setAds] = useState<Ad[]>();

  useEffect(() => {
    const fetchAds = async () => {
      const response = await API.get('api', '/commercials', {});
      setAds(response);
    };

    fetchAds();
  }, []);

  const onCreateUpdateAd = (ad: Ad) => {
    setAds([ad, ...ads!]);
  };

  const onRemoveAd = (adId: string) => {
    setAds(ads!.filter((ad) => ad.id !== adId));
  };

  return (
    <div>
      <Ads
        ads={ads}
        onCreateUpdateAd={onCreateUpdateAd}
        onRemoveAd={onRemoveAd}
      />
    </div>
  );
}

export default HomePage;
