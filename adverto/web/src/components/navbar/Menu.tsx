import { Auth } from 'aws-amplify';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import { User, UserRole } from '../../types';
import MenuToggleButton from './MenuToggleButton';
import './navbar-menu-animation.css';

type Props = {
  toggleMenu: () => void;
};

function Menu({ toggleMenu }: Props) {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const renderMenuLinks = () => {
    const menuLinks = [
      { text: 'Home', pathname: '/' },
      { text: 'Profile', pathname: `advertisers/${user!.attributes.sub}` },
      {
        text: 'Account settings',
        pathname: '/account-settings',
      },
    ];

    if (user?.roles.includes(UserRole.ADMIN)) {
      menuLinks.splice(2, 0, { text: 'Users', pathname: '/admin-users' });
    }

    return menuLinks.map((menuLink) => (
      <Link key={menuLink.pathname} to={menuLink.pathname} onClick={toggleMenu}>
        <div className='w-full px-3 py-2 border-gray-100 border-b-2 text-center hover:bg-gray-100'>
          {menuLink.text}
        </div>
      </Link>
    ));
  };

  const signOut = async () => {
    await Auth.signOut();
    navigate('/login');
    setUser(undefined);
    toggleMenu();
  };

  return (
    <div className='flex flex-row absolute top-0 w-screen navbar-menu-animation'>
      <div className='bg-black opacity-70 flex-grow' onClick={toggleMenu}></div>
      <div className='w-56 md:w-72 h-screen bg-white'>
        <div className='flex flex-row items-center justify-end bg-blue-500 pr-4 text-white py-1'>
          <MenuToggleButton toggleMenu={toggleMenu} />
        </div>
        {renderMenuLinks()}
        <button className='w-full' onClick={signOut}>
          <div className='px-3 py-2 border-gray-100 border-b-2 text-center hover:bg-gray-100'>
            Sign out
          </div>
        </button>
      </div>
    </div>
  );
}

export default Menu;
