import { useState } from 'react'
import NavBar from "./components/NavBar.jsx";
import Footer from './components/Footer.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NavBar/>
      <Footer/>
    </>
  )
}

export default App
