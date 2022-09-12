import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PreferredMFA, User } from '../../types';
import { getUser } from '../../utils/aws/aws.utils';
import Menu from './Menu';
import MenuToggleButton from './MenuToggleButton';

function Navbar() {
  const [user, setUser] = useState<User>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const loadUser = async () => {
      setUser(await getUser());
    };

    loadUser();
  }, []);

  return (
    <div className='flex flex-row justify-end sticky top-0 z-30'>
      <div className='w-screen flex flex-row justify-between items-center bg-blue-600 text-white pl-4 pr-4 py-1 flex-wrap'>
        <div className='flex justify-center flex-grow md:flex-grow-0'>
          <Link to='' className='flex flex-row items-center text-2xl'>
            Adverto
          </Link>
        </div>
        {user ? (
          <div className='flex items-center'>
            <div className='flex justify-center items-center md:ml-12'>
              <MenuToggleButton toggleMenu={toggleMenu} />
            </div>
          </div>
        ) : (
          <div className='text-lg my-2 flex-grow flex justify-end'>
            <Link to='/login' className='mr-4'>
              Log in
            </Link>
            <Link to='/signup'>Sign up</Link>
          </div>
        )}
      </div>
      {user && isMenuOpen && <Menu toggleMenu={toggleMenu} user={user} />}
    </div>
  );
}

export default Navbar;
