import { useLocation, useNavigate } from 'react-router-dom';
import AdForm from '../components/ads/AdForm';
import { Ad } from '../types';

type State = {
  ad: Ad;
};

function UpdateAdPage() {
  const location = useLocation();
  const { ad } = location.state as State;

  const navigate = useNavigate();

  return (
    <div className='flex justify-center pt-10'>
      <AdForm onCreateUpdateAd={(ad) => navigate('/')} ad={ad} />
    </div>
  );
}

export default UpdateAdPage;
