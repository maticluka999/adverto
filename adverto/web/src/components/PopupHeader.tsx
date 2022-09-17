type Props = {
  title: string | undefined;
  toggle: () => void;
};

function PopupHeader({ title, toggle }: Props) {
  return (
    <div className='flex justify-between items-center py-2 px-3 border-gray-300 border-b-2'>
      <p className='flex-grow text-center text-xl'>{title}</p>
      <button className='self-end' onClick={toggle}>
        <svg
          aria-label='Close'
          color='#262626'
          fill='#262626'
          height='24'
          role='img'
          viewBox='0 0 48 48'
          width='24'
        >
          <path
            clipRule='evenodd'
            d='M41.1 9.1l-15 15L41 39c.6.6.6 1.5 0 2.1s-1.5.6-2.1 0L24 26.1l-14.9 15c-.6.6-1.5.6-2.1 0-.6-.6-.6-1.5 0-2.1l14.9-15-15-15c-.6-.6-.6-1.5 0-2.1s1.5-.6 2.1 0l15 15 15-15c.6-.6 1.5-.6 2.1 0 .6.6.6 1.6 0 2.2z'
            fillRule='evenodd'
          ></path>
        </svg>
      </button>
    </div>
  );
}

export default PopupHeader;
