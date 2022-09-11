import { useRef, useState } from 'react';
import { Ad } from '../../types';
import LoadingSpinner from '../LoadingSpinner';

type Props = {
  onCreateAd: (ad: Ad) => void;
};

function CreateAdSection({ onCreateAd }: Props) {
  const postTextTextArea = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const [postText, setPostText] = useState('');
  const [fileNameText, setFileNameText] = useState('');
  const [errorText, setErrorText] = useState('');
  const [fetching, setFetching] = useState(false);

  const postTextChangedHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPostText(event.target.value);
  };

  const fileInputHandler = () => {
    const file: File = fileInput.current!.files![0];
    console.log(fileInput.current!.files!);

    if (!file) {
      return;
    }

    setFileNameText(file.name);
    setErrorText('');
  };

  const openFileChooser = () => {
    removeCurrentFile();
    fileInput.current?.click();
  };

  const removeCurrentFile = () => {
    fileInput.current!.value = '';
    setFileNameText('');
  };

  const [formOpen, setFormOpen] = useState(false);

  const createAd = () => {};

  return (
    <div className='flex flex-col items-center justify-center'>
      {!formOpen ? (
        <button
          className='justify-center btnGreenWhite m-4 mb-3'
          onClick={() => setFormOpen(true)}
        >
          Create new ad
        </button>
      ) : (
        <div className='flex flex-col bg-white mt-5 w-screen md:w-[614px] rounded shadow-lg p-4 pb-3'>
          <div className='flex items-start'>
            <div className='flex flex-col flex-grow'>
              <button onClick={() => setFormOpen(false)}>close</button>
              <p className='ml-3'>{fileNameText}</p>
              <p className='text-red-600 ml-3'>{errorText}</p>
              <div className='flex items-center self-end'>
                {!fetching && (
                  <button
                    className='btnWhiteGreen mt-3 mr-4'
                    onClick={openFileChooser}
                    hidden={!!fileNameText}
                  >
                    <input
                      type='file'
                      accept='.png,.jpg,.jpeg'
                      ref={fileInput}
                      onInput={fileInputHandler}
                      hidden
                    />
                    Upload image
                  </button>
                )}
                {fileNameText && !fetching && (
                  <button
                    className='btnWhiteRed mt-3 mr-4'
                    onClick={removeCurrentFile}
                  >
                    Remove image
                  </button>
                )}
                <div className='flex items-center mt-3 mr-3'>
                  {fetching ? (
                    <div className='flex items-center justify-center w-20'>
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <button className='btnGreenWhite' onClick={createAd}>
                      Create
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateAdSection;
