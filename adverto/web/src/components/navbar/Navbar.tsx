import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PreferredMFA, User } from '../../types';
import Menu from './Menu';
import MenuToggleButton from './MenuToggleButton';

function Navbar() {
  const [user, setUser] = useState<User>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        console.log(currentUser);
        const attributes = {
          sub: currentUser.attributes.sub,
          email: currentUser.attributes.email,
          givenName: currentUser.attributes.given_name,
          familyName: currentUser.attributes.family_name,
          phoneNumber: currentUser.attributes.phone_number,
          phoneNumberVerified: currentUser.attributes.phone_number_verified,
          picture: currentUser.attributes.picture,
        };
        const preferredMFA =
          PreferredMFA[currentUser.preferredMFA as keyof typeof PreferredMFA];
        const user = {
          attributes,
          preferredMFA,
        };
        setUser(user);
      } catch {}
    };

    checkLoggedIn();
  }, []);

  return (
    <div className='flex flex-row justify-end sticky top-0 z-30'>
      <div className='w-screen flex flex-row justify-between items-center bg-blue-500 text-white pl-4 pr-4 py-1 flex-wrap'>
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
            <Link to='/' className='mr-4'>
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
