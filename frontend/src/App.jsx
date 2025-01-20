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

function App() {
  return (
    <>
      <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/recordings' element={<Recordings />} />
            <Route path='/login' element={<Login />}/>
            <Route path='/signup' element={<Signup />}/>
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile/update-profile' element={<UpdateProfile />} />
            <Route path='/profile/update-password' element={<UpdatePassword />} />
            <Route path='/profile/register-guest' element={<RegisterGuest />} />
          </Routes>
      </Router>
    </>
  )
}

export default App
