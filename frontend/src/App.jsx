import { BrowserRouter as Router, Routes, Route, useLocation, useLoaderData } from 'react-router';
// Components
import NavBar from "./components/NavBar.jsx";
import Footer from './components/Footer.jsx';
import Home from './components/Home.jsx';
import Recordings from './components/Recordings.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Profile from './components/Profile.jsx';

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
          </Routes>
      </Router>
    </>
  )
}

export default App
