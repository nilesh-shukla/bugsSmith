import './App.css'
import Navigation from './components/Navigation'
import Home from './components/Home';
import Resources from './pages/Resources'
import About from './pages/About';
import Solutions from './pages/SolutionsPage';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/resources' element={<Resources />} />
          <Route path='/about' element={<About/>}/>
          <Route path='/solutions' element={<Solutions/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
