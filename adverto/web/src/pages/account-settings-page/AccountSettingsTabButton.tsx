import { AccountSettingsPageTab } from './AccountSettingsPage';

type Props = {
  tab: AccountSettingsPageTab;
  text: string;
  selectedTab: AccountSettingsPageTab;
  setSelectedTab: (tab: AccountSettingsPageTab) => void;
  Icon: any;
};

function AccountSettingsTabButton({
  tab,
  text,
  selectedTab,
  setSelectedTab,
  Icon,
}: Props) {
  const isSelected = selectedTab === tab;

  return (
    <button
      className={`flex flex-1 flex-col items-center pt-3 ${
        isSelected && 'text-blue-600 border-b-2 border-blue-500'
      }`}
      onClick={() => setSelectedTab(tab)}
    >
      <Icon className={`w-5 h-5 ${isSelected && 'text-blue-600'}`} />
      <div>{text}</div>
    </button>
  );
}

export default AccountSettingsTabButton;
