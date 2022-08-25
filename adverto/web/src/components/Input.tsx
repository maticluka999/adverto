import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  text?: string;
};

function Input({ text, ...rest }: Props, ref: ForwardedRef<HTMLInputElement>) {
  return (
    <div className='flex flex-wrap items-center'>
      {text && <p className='my-1 w-44 whitespace-nowrap'>{text}</p>}
      <input
        className='input p-1 flex-grow md:w-72 md:text-lg'
        {...rest}
        ref={ref}
      />
    </div>
  );
}

export default forwardRef(Input);
