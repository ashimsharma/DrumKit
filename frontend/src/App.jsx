import { BrowserRouter as Router, Routes, Route, useLocation, useLoaderData } from 'react-router';
// Components
import NavBar from "./components/NavBar.jsx";
import Footer from './components/Footer.jsx';
import Home from './components/Home.jsx';
import Recordings from './components/Recordings.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Layout from './components/Layout.jsx';

function App() {
  return (
    <>
      <Router>
          <Routes>
            <Route path='/' element={<Layout><Home /></Layout>} />
            <Route path='/recordings' element={<Layout><Recordings /></Layout>} />
            <Route path='/login' element={<Layout><Login /></Layout>}/>
            <Route path='/signup' element={<Layout><Signup /></Layout>}/>
          </Routes>
      </Router>
    </>
  )
}

export default App
