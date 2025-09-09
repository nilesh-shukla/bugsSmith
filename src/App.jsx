import './App.css'
import Navigation from './components/Navigation'
import Home from './components/Home';
import Resources from './pages/Resources'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/resources' element={<Resources />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
