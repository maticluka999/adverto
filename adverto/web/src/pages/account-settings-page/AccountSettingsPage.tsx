import { useContext, useState } from 'react';
import { ReactComponent as ShieldCheck } from '../../assets/icons/shield-check.svg';
import { ReactComponent as UserCircle } from '../../assets/icons/user-circle.svg';
import LoadingSpinner from '../../components/LoadingSpinner';
import AuthContext from '../../context/auth-context';
import AccountSettingsTabButton from './AccountSettingsTabButton';
import PersonalInfoTab from './PersonalInfoTab';
import SecurityTab from './SecurityTab';

export enum AccountSettingsPageTab {
  PERSONAL_INFO = 'personal_info',
  SECURITY = 'security',
}

function AccountSettingsPage() {
  const [selectedTab, setSelectedTab] = useState(
    AccountSettingsPageTab.PERSONAL_INFO
  );
  const { user, setUser } = useContext(AuthContext);

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
        return <PersonalInfoTab />;
      case AccountSettingsPageTab.SECURITY:
        return <SecurityTab />;
    }
  };

  return (
    <div className='flex justify-center bg-gray-200 p-5 md:py-10 md:pt-20'>
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
