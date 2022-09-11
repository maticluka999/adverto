import { Ad, Action, ActionColor } from '../../types';
import ActionsPopup from '../ActionsPopup';

type Props = {
  ad: Ad;
  toggle: () => void;
  onRemoveAd: (adId: string) => void;
};

function AdActionsPopup({ ad, toggle, onRemoveAd }: Props) {
  const editAd = () => {};

  const removeAd = () => {};

  const generateActions = (): Action[] => {
    const actions: Action[] = [];

    if (ad.advertiserId === '1') {
      const editAdAction = {
        name: 'Edit',
        execute: editAd,
        color: ActionColor.BLACK,
      };
      actions.push(editAdAction);
    }

    if (ad.advertiserId === '1') {
      const removeAdAction = {
        name: 'Remove',
        execute: removeAd,
        color: ActionColor.RED,
      };
      actions.push(removeAdAction);
    }

    return actions;
  };

  return <ActionsPopup toggle={toggle} actions={generateActions()} />;
}

export default AdActionsPopup;
