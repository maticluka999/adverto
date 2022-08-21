import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ConfirmSignupPage from './pages/ConfirmSignupPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function MyRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/confirm-signup' element={<ConfirmSignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MyRouter;