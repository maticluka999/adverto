import { FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';

interface Props {
  text:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
}

function ErrorLabel(props: Props) {
  return (
    <div className='mt-1 mb-3 w-80'>
      <p className='text-red-600 text-center text-base'>{props.text}</p>
    </div>
  );
}

export default ErrorLabel;
