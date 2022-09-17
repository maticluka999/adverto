import PopupHeader from './PopupHeader';
import './popup-animation.css';
import { Action, ActionColor } from '../types';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

type Props = {
  title?: string;
  toggle: () => void;
  actions?: Action[];
  fetching: boolean;
};

function ActionsPopup({ title, toggle, actions, fetching }: Props) {
  const renderActions = () => {
    return (
      <div className='flex flex-col'>
        {fetching ? (
          <div className='flex my-2 justify-center'>
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {actions &&
              actions.map((action, index) => {
                return (
                  <button
                    key={index}
                    className={
                      'h-10 mx-2' +
                      (action.color === ActionColor.RED
                        ? ' text-red-500'
                        : '') +
                      (index !== actions.length - 1 ? ' border-b-2' : '')
                    }
                    onClick={action.execute}
                  >
                    {action.name}
                  </button>
                );
              })}
          </>
        )}
      </div>
    );
  };

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 h-full w-full z-40 popup-animation'>
      <div className='flex items-center justify-center h-full'>
        <div className='flex flex-col bg-white w-60 rounded-lg md:-mt-52'>
          <PopupHeader
            title={title}
            toggle={() => {
              if (!fetching) {
                toggle();
              }
            }}
          />
          {renderActions()}
        </div>
      </div>
    </div>
  );
}

export default ActionsPopup;
