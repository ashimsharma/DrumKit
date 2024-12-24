import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router';
// Components
import NavBar from "./components/NavBar.jsx";
import Footer from './components/Footer.jsx';
import Home from './components/Home.jsx';
import Recordings from './components/Recordings.jsx';


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <NavBar />
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/recordings' element={<Recordings />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </>
  )
}

export default App
