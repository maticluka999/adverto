import { useState } from 'react';
import * as yup from 'yup';
import { Ad } from '../../types';
import AdForm from './AdForm';

type Props = {
  onCreateUpdateAd: (ad: Ad) => void;
};

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  text: yup.string().required('Text is required'),
  price: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Price is required'),
});

function CreateAdSection({ onCreateUpdateAd }: Props) {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className='flex flex-col items-center justify-center mt-5'>
      {!formOpen ? (
        <button
          className='justify-center btnPrimary m-4 mb-3'
          onClick={() => {
            setFormOpen(true);
          }}
        >
          Publish new ad
        </button>
      ) : (
        <AdForm
          onCreateUpdateAd={(ad) => {
            onCreateUpdateAd(ad);
            setFormOpen(false);
          }}
          setFormOpen={setFormOpen}
        />
      )}
    </div>
  );
}

export default CreateAdSection;
