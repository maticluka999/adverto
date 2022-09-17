type Props = {
  text: string;
};

function Checkbox({ text }: Props) {
  return (
    <div>
      <label className='flex items-center'>
        <input className='mr-2 h-4 w-4' type='checkbox' disabled />
        <span>{text}</span>
      </label>
    </div>
  );
}

export default Checkbox;
