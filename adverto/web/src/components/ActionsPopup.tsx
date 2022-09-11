import PopupHeader from './PopupHeader';
import './popup-animation.css';
import { Action, ActionColor } from '../types';

function ActionsPopup(props: {
  title?: string;
  toggle: () => void;
  actions: Action[];
}) {
  const renderActions = () => {
    return (
      <div className='flex flex-col'>
        {props.actions.map((action, index) => {
          return (
            <button
              className={
                'h-10 mx-2' +
                (action.color === ActionColor.RED ? ' text-red-500' : '') +
                (index !== props.actions.length - 1 ? ' border-b-2' : '')
              }
              onClick={action.execute}
            >
              {action.name}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 h-full w-full z-40 popup-animation'>
      <div className='flex items-center justify-center h-full'>
        <div className='flex flex-col bg-white w-60 rounded-lg md:-mt-52'>
          <PopupHeader title={props.title} toggle={props.toggle} />
          {renderActions()}
        </div>
      </div>
    </div>
  );
}

export default ActionsPopup;
