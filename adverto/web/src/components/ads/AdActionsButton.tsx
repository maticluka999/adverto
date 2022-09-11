import { useState } from 'react';
import { Ad } from '../../types';
import ActionsButton from '../ActionsButton';
import AdActionsPopup from './AdActionsPopup';

type Props = {
  ad: Ad;
  onRemoveAd: (adId: string) => void;
};

function AdActionsButton({ ad, onRemoveAd }: Props) {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <div>
      {isPopupVisible && (
        <AdActionsPopup ad={ad} toggle={togglePopup} onRemoveAd={onRemoveAd} />
      )}
      <ActionsButton togglePopup={togglePopup} />
    </div>
  );
}

export default AdActionsButton;
