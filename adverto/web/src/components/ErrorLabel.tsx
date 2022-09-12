import { FieldError, Merge, FieldErrorsImpl } from 'react-hook-form';

interface Props {
  text:
    | string
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | undefined;
  additinalClassName?: string;
}

function ErrorLabel({ text, additinalClassName }: Props) {
  return (
    <div className={`mt-1 mb-3 w-80 ${additinalClassName}`}>
      <p className='text-red-600 text-center text-base'>{text}</p>
    </div>
  );
}

export default ErrorLabel;
