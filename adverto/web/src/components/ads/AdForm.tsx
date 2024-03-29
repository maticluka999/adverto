import { yupResolver } from '@hookform/resolvers/yup';
import { API } from 'aws-amplify';
import { useContext, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import AuthContext from '../../context/auth-context';
import { Ad } from '../../types';
import ErrorLabel from '../ErrorLabel';
import Input from '../Input';
import LoadingSpinner from '../LoadingSpinner';
import { ReactComponent as XMark } from './../../assets/icons/x-mark.svg';

type Props = {
  onCreateUpdateAd: (ad: Ad) => void;
  setFormOpen?: (formOpen: boolean) => void;
  ad?: Ad;
};

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  text: yup.string().required('Text is required'),
  price: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Price is required'),
});

function AdForm({ onCreateUpdateAd, setFormOpen, ad }: Props) {
  const { user } = useContext(AuthContext);
  const fileInput = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File>();
  const [fetching, setFetching] = useState(false);
  const [errorText, setErrorText] = useState('');

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: ad ? ad.title : '',
      text: ad ? ad.text : '',
      price: ad ? ad.price.toString() : '',
    },
  });

  const fileInputHandler = () => {
    const file: File = fileInput.current!.files![0];
    console.log(fileInput.current!.files!);

    if (!file) {
      return;
    }

    setFile(file);
    setErrorText('');
  };

  const openFileChooser = () => {
    console.log('asd');
    removeCurrentFile();
    fileInput.current?.click();
  };

  const removeCurrentFile = () => {
    fileInput.current!.value = '';
    setFile(undefined);
  };

  const onSubmit = async (data: Record<string, string>) => {
    setErrorText('');

    const body = {
      id: ad?.id,
      title: data.title,
      text: data.text,
      price: data.price,
      imageContentType: file?.type,
      imageUrl: ad?.imageUrl,
    };

    setFetching(true);
    let response;

    try {
      if (ad) {
        response = await API.put('api', '/commercials', { body });
      } else {
        response = await API.post('api', '/commercials', { body });
      }

      if (response.presignedPostData) {
        const formData = new FormData();
        formData.append('Content-Type', file!.type);
        Object.entries(response.presignedPostData.fields).forEach(
          ([k, v]: any[]) => {
            console.log(k, v);
            formData.append(k, v);
          }
        );
        formData.append('file', file!); // The file has to be the last element

        const uploadResponse = await fetch(response.presignedPostData.url, {
          method: 'POST',
          // headers: [['Content-Type', 'multipart/form-data']],
          body: formData,
        });

        console.log(uploadResponse);

        if (ad) {
          //because of image caching in browser
          const refreshedImage = await fetch(response.ad.imageUrl);
        }
      }

      const resultAd = {
        ...response.ad,
        advertiser: user!.attributes,
      };
      console.log(resultAd);
      onCreateUpdateAd(resultAd);
      setFetching(false);
    } catch (error) {
      setFetching(false);
      console.error(error);
      alert('Failed to publish ad.');
      return;
    }
  };

  return (
    <div className='flex flex-col bg-white mt-5 w-screen md:w-[630px] rounded shadow-lg p-4 pb-3'>
      <form
        className='flex flex-col flex-grow'
        onSubmit={handleSubmit(onSubmit)}
      >
        {setFormOpen && (
          <button
            className='self-end text-blue-600 mb-4'
            onClick={() => setFormOpen(false)}
          >
            <XMark />
          </button>
        )}
        <div className='lg:w-[350px]'>
          <Input
            {...register('title')}
            text='Title:'
            additionalTextClassName={'w-[50px]'}
          />
        </div>
        <ErrorLabel additinalClassName='w-56' text={errors.title?.message} />
        <Input
          {...register('text')}
          text='Text:'
          additionalTextClassName={'w-[50px]'}
        />
        <ErrorLabel additinalClassName='w-56' text={errors.text?.message} />
        <div className='w-[200px]'>
          <Input
            {...register('price')}
            type='number'
            text='Price:'
            additionalTextClassName={'w-[50px]'}
            additionalInputClassName={'w-20'}
          />
        </div>
        <ErrorLabel additinalClassName='w-56' text={errors.price?.message} />
        <p className='text-red-600 ml-3'>{errorText}</p>
        <div className='flex items-center self-end'>
          {!fetching && (
            <>
              <button
                className='btnSecondary mt-3 mr-4'
                onClick={(e) => {
                  e.preventDefault();
                  openFileChooser();
                }}
                hidden={!!file}
              >
                Upload image
              </button>
              <input
                type='file'
                accept='.png,.jpg,.jpeg'
                ref={fileInput}
                onInput={fileInputHandler}
                hidden
              />
            </>
          )}
          {file && !fetching && (
            <button
              className='text-blue-600 hover:underline mt-3 mr-4'
              onClick={(e) => {
                e.preventDefault();
                removeCurrentFile();
              }}
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
              <button className='btnPrimary'>
                {ad ? 'Update' : 'Publish'}
              </button>
            )}
          </div>
        </div>
      </form>
      {file && <img className='mt-3' src={URL.createObjectURL(file)} />}
      {!file && ad && <img className='mt-3' src={ad.imageUrl} />}
    </div>
  );
}

export default AdForm;
