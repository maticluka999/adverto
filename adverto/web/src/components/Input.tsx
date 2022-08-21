import { ForwardedRef, forwardRef, InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  text: string;
  placeholder: string;
};

function Input(
  { text, placeholder, ...rest }: Props,
  ref: ForwardedRef<HTMLInputElement>
) {
  return (
    <div className='flex flex-wrap items-center'>
      <p className='my-1 w-44 whitespace-nowrap'>{text}</p>
      <input
        className='input p-1 flex-grow md:w-60 md:text-lg'
        {...rest}
        ref={ref}
      />
    </div>
  );
}

export default forwardRef(Input);
