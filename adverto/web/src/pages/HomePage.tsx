import { useState } from 'react';
import Ads from '../components/ads/Ads';
import { testAds } from '../components/ads/test-ads';
import { Ad } from '../types';
import { executeSignedApi as invokeApi } from '../utils/aws/aws.utils';
import { HttpMethod } from '../utils/http-method.enum';

function HomePage() {
  const [ads, setAds] = useState<Ad[]>(testAds);

  const onCreateAd = (ad: Ad) => {
    setAds([ad, ...ads!]);
  };

  const onRemoveAd = (adId: string) => {
    setAds(ads!.filter((ad) => ad.id !== adId));
  };

  const getAds = async () => {
    console.log('getAds');
    const response = await invokeApi(HttpMethod.GET, '/ads');
    console.log(response);
  };

  return (
    <div>
      <button className='btnSecondary' onClick={getAds}>
        Get all ads
      </button>
      <Ads ads={ads} onCreateAd={onCreateAd} onRemoveAd={onRemoveAd} />
    </div>
  );
}

export default HomePage;
