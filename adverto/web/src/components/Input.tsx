import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  text?: string;
  disabled?: boolean;
};

function Input(
  { text, disabled, ...rest }: Props,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <div className='flex flex-wrap items-center w-full'>
      {text && <p className='my-1 w-44 whitespace-nowrap'>{text}</p>}
      <input
        className={`input p-1 flex-grow md:text-lg ${
          disabled && 'bg-gray-200'
        }`}
        disabled={disabled}
        {...rest}
        ref={ref}
      />
    </div>
  );
}

export default forwardRef(Input);
