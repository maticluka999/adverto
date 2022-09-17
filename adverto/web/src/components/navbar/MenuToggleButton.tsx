type Props = { toggleMenu: () => void };

const MenuToggleButton = ({ toggleMenu }: Props) => {
  return (
    <button
      onClick={toggleMenu}
      className='rounded-full p-1 active:bg-blue-400'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-9 w-9'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M4 6h16M4 12h16M4 18h16'
        />
      </svg>
    </button>
  );
};

export default MenuToggleButton;
