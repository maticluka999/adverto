import { API } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { Ad, Action, ActionColor, UserRole } from '../../types';
import { getUser } from '../../utils/aws/aws.utils';
import ActionsPopup from '../ActionsPopup';

type Props = {
  ad: Ad;
  toggle: () => void;
  onRemoveAd: (adId: string) => void;
};

function AdActionsPopup({ ad, toggle, onRemoveAd }: Props) {
  const [fetching, setFetching] = useState(false);
  const [actions, setActions] = useState<Action[]>();

  const editAd = () => {};

  const removeAd = async () => {
    setFetching(true);

    const user = await getUser();

    if (user.roles.includes(UserRole.ADMIN)) {
      try {
        await API.del(
          'api',
          `/admin-delete-ad?pk=${ad.advertiser.sub}&sk=${ad.id}`,
          {}
        );
        onRemoveAd(ad.id);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await API.del('api', `/ads/${ad.id}`, {});
        onRemoveAd(ad.id);
      } catch (error) {
        console.error(error);
      }
    }

    setFetching(false);
  };

  useEffect(() => {
    const generateActions = async () => {
      const user = await getUser();
      const actions: Action[] = [];

      if (ad.advertiser.sub === user.attributes.sub) {
        const editAdAction = {
          name: 'Edit',
          execute: editAd,
          color: ActionColor.BLACK,
          setFetching,
        };
        actions.push(editAdAction);
      }

      if (
        ad.advertiser.sub === user.attributes.sub ||
        user.roles.includes(UserRole.ADMIN)
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
