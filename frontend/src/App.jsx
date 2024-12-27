import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router';
// Components
import NavBar from "./components/NavBar.jsx";
import Footer from './components/Footer.jsx';
import Home from './components/Home.jsx';
import Recordings from './components/Recordings.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';

function App() {
  // const location = useLocation();
  // console.log(location.pathname);
  const location = window.location.pathname;
  const isAuthPage = (location === "/login") || (location === "/signup");

  return (
    <>
      <Router>
        {!isAuthPage && <NavBar />}
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/recordings' element={<Recordings/>} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup />}/>
          </Routes>
        {!isAuthPage && <Footer />}
      </Router>
    </>
  )
}

export default App
