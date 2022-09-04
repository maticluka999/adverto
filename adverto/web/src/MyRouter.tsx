import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AccountSettingsPage from './pages/account-settings-page/AccountSettingsPage';
import ConfirmSignupPage from './pages/ConfirmSignupPage';
import ResetPasswordPage from './pages/reset-password-page/ResetPasswordPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyPhoneNumberPage from './pages/VerifyPhoneNumberPage';

function MyRouter() {
  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}

export default MyRouter;
