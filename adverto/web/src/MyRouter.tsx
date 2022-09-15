import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AccountSettingsPage from './pages/account-settings-page/AccountSettingsPage';
import ConfirmSignupPage from './pages/ConfirmSignupPage';
import ResetPasswordPage from './pages/reset-password-page/ResetPasswordPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyPhoneNumberPage from './pages/VerifyPhoneNumberPage';
import Navbar from './components/navbar/Navbar';
import ProfilePage from './pages/profile-page/ProfilePage';

import ScrollToTop from './ScrollToTop';
import UpdateAdPage from './pages/UpdateAdPage';

function MyRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/confirm-signup' element={<ConfirmSignupPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/account-settings' element={<AccountSettingsPage />} />
        <Route
          path='/verify-phone-number'
          element={<VerifyPhoneNumberPage />}
        />
        <Route path='/advertisers/:sub' element={<ProfilePage />} />
        <Route path='/update-ad' element={<UpdateAdPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MyRouter;
