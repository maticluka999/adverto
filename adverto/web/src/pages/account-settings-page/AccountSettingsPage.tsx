import { ReactComponent as UserCircle } from '../../assets/icons/user-circle.svg';
import { ReactComponent as ShieldCheck } from '../../assets/icons/shield-check.svg';
import AccountSettingsTabButton from './AccountSettingsTabButton';
import { useEffect, useState } from 'react';
import PersonalInfoTab from './PersonalInfoTab';
import SecurityTab from './SecurityTab';
import { Auth } from 'aws-amplify';
import { PreferredMFA, User } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

export enum AccountSettingsPageTab {
  PERSONAL_INFO = 'personal_info',
  SECURITY = 'security',
}

function AccountSettingsPage() {
  const [selectedTab, setSelectedTab] = useState(
    AccountSettingsPageTab.PERSONAL_INFO
  );
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const setupUser = async () => {
      const currentUser = await Auth.currentAuthenticatedUser();
      const attributes = {
        email: currentUser.attributes.email,
        givenName: currentUser.attributes.given_name,
        familyName: currentUser.attributes.family_name,
        phoneNumber: currentUser.attributes.phone_number,
        phoneNumberVerified: currentUser.attributes.phone_number_verified,
        profilePicture: currentUser.attributes.profile_picture,
      };
      const preferredMFA =
        PreferredMFA[currentUser.preferredMFA as keyof typeof PreferredMFA];
      const user = {
        attributes,
        preferredMFA,
      };
      setUser(user);
    };

    setupUser();
  }, []);

  const renderTabButtons = () => {
    return (
      <div className='flex justify-around bg-white p-5 pt-0'>
        <AccountSettingsTabButton
          tab={AccountSettingsPageTab.PERSONAL_INFO}
          text='Personal info'
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          Icon={UserCircle}
        />
        <div className='self-center h-8 w-[1px] bg-gray-300'></div>
        <AccountSettingsTabButton
          tab={AccountSettingsPageTab.SECURITY}
          text='Security'
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          Icon={ShieldCheck}
        />
      </div>
    );
  };

  const renderTab = () => {
    switch (selectedTab) {
      case AccountSettingsPageTab.PERSONAL_INFO:
        return <PersonalInfoTab userAttributes={user!.attributes} />;
      case AccountSettingsPageTab.SECURITY:
        return <SecurityTab user={user!} />;
    }
  };

  return (
    <div className='flex justify-center h-screen bg-gray-200 p-5 md:py-10 md:pt-20'>
      <div className='flex flex-col w-full md:w-[530px] bg-white'>
        {renderTabButtons()}
        {user ? (
          renderTab()
        ) : (
          <div className='flex w-full h-40 items-center justify-center'>
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountSettingsPage;
