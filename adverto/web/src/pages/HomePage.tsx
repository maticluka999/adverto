import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { executeSignedApi as invokeApi } from '../utils/aws.utils';
import { HttpMethod } from '../utils/http-method.enum';

function HomePage() {
  const navigate = useNavigate();

  const getAds = async () => {
    console.log('getAds');
    const response = await invokeApi(HttpMethod.GET, '/ads');
    console.log(response);
  };

  const invokeAdvertiserFunction = async () => {
    const response = await invokeApi(HttpMethod.GET, '/advertiser-function');
    console.log(response);
  };

  const invokeAdminFunction = async () => {
    const response = await invokeApi(HttpMethod.GET, '/admin-function');
    console.log(response);
  };

  return (
    <div>
      Home page
      <button
        className='btnSecondary'
        onClick={async () => {
          await Auth.signOut();
          navigate('/login');
        }}
      >
        Sign out
      </button>
      <button className='btnSecondary' onClick={getAds}>
        Get all ads
      </button>
      <button className='btnSecondary' onClick={invokeAdvertiserFunction}>
        Advertiser function
      </button>
      <button className='btnSecondary' onClick={invokeAdminFunction}>
        Admin function
      </button>
    </div>
  );
}

export default HomePage;
