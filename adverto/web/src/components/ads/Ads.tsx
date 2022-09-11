import { useState } from 'react';
import { Ad } from '../../types';
import LoadingSpinner from '../LoadingSpinner';
import AdList from './AdList';
import CreateAdSection from './CreateAdSection';
import { testAds } from './test-ads';

type Props = {
  ads?: Ad[];
  onCreateAd: (ad: Ad) => void;
  onRemoveAd: (adId: string) => void;
};

function Ads({ ads, onCreateAd, onRemoveAd }: Props) {
  return (
    <div className='flex flex-col w-full items-center'>
      {ads ? (
        <>
          <CreateAdSection onCreateAd={onCreateAd} />
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
