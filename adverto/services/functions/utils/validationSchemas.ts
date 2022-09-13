import * as yup from 'yup';

export const adValidationSchema = yup.object({
  title: yup.string().required('Title is required'),
  text: yup.string().required('Text is required'),
  price: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .required('Price is required'),
  imageContentType: yup
    .string()
    .oneOf(['image/png', 'image/jpg', 'image/jpeg']),
});
