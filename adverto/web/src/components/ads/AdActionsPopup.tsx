import { API } from 'aws-amplify';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/auth-context';
import { Ad, Action, ActionColor, UserRole } from '../../types';
import ActionsPopup from '../ActionsPopup';

type Props = {
  ad: Ad;
  toggle: () => void;
  onRemoveAd: (adId: string) => void;
};

function AdActionsPopup({ ad, toggle, onRemoveAd }: Props) {
  const { user } = useContext(AuthContext);

  const [fetching, setFetching] = useState(false);
  const [actions, setActions] = useState<Action[]>();

  const editAd = () => {};

  const removeAd = async () => {
    setFetching(true);

    if (user?.roles.includes(UserRole.ADMIN)) {
      try {
        await API.del(
          'api',
          `/commercials/${ad.id}/admin?pk=${ad.advertiser.sub}`,
          {}
        );
        onRemoveAd(ad.id);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await API.del('api', `/commercials/${ad.id}`, {});
        onRemoveAd(ad.id);
      } catch (error) {
        console.error(error);
      }
    }

    setFetching(false);
  };

  useEffect(() => {
    const generateActions = async () => {
      const actions: Action[] = [];

      if (ad.advertiser.sub === user?.attributes.sub) {
        const editAdAction = {
          name: 'Edit',
          execute: editAd,
          color: ActionColor.BLACK,
          setFetching,
        };
        actions.push(editAdAction);
      }

      if (
        ad.advertiser.sub === user?.attributes.sub ||
        user?.roles.includes(UserRole.ADMIN)
      ) {
        const removeAdAction = {
          name: 'Remove',
          execute: removeAd,
          color: ActionColor.RED,
          setFetching,
        };
        actions.push(removeAdAction);
      }

      setActions(actions);
    };

    generateActions();
  }, []);

  return <ActionsPopup toggle={toggle} actions={actions} fetching={fetching} />;
}

export default AdActionsPopup;
