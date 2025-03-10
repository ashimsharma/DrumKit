import { BrowserRouter as Router, Routes, Route, useLocation, useLoaderData } from 'react-router';
// Components
import Home from './components/Home.jsx';
import Recordings from './components/Recordings.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Profile from './components/Profile.jsx';
import UpdateProfile from './components/UpdateProfile.jsx';
import UpdatePassword from './components/UpdatePassword.jsx';
import RegisterGuest from './components/RegisterGuest.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import VerifyEmail from './components/VerifyEmail.jsx';
import ForgotPasswordEmailInput from './components/ForgotPasswordEmailInput.jsx';
import NewPassword from './components/NewPassword.jsx';

function App() {
  return (
    <Provider store={store}>
      <>
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/recordings' element={<Recordings />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/verify-email' element={<VerifyEmail/>} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile/update-profile' element={<UpdateProfile />} />
            <Route path='/profile/update-password' element={<UpdatePassword />} />
            <Route path='/forgot-password-email-input' element={<ForgotPasswordEmailInput />} />
            <Route path='/new-password' element={<NewPassword />} />
            <Route path='/profile/register-guest' element={<RegisterGuest />} />
          </Routes>
        </Router>
      </>
    </Provider>
  )
}

export default App
