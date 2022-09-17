import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  text?: string;
  additionalTextClassName?: string;
  disabled?: boolean;
  additionalInputClassName?: string;
};

function Input(
  {
    text,
    additionalTextClassName,
    disabled,
    additionalInputClassName,
    ...rest
  }: Props,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <div className='flex flex-wrap items-center w-full'>
      {text && (
        <p className={`my-1 whitespace-nowrap w-44 ${additionalTextClassName}`}>
          {text}
        </p>
      )}
      <input
        className={`input p-1 flex-grow md:text-lg ${
          disabled && 'bg-gray-200'
        } ${additionalInputClassName}`}
        disabled={disabled}
        {...rest}
        ref={ref}
      />
    </div>
  );
}

export default forwardRef(Input);
