import './App.css'
import LayoutWithNav from "./components/LayoutWithNav";
import Home from './components/Home';
import Resources from './pages/Resources'
import About from './pages/About';
import Solutions from './pages/SolutionsPage';
import Contact from './pages/Contact';
import AnalyzePage from './pages/AnalyzePage';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route element={<LayoutWithNav />}>
            <Route path="/" element={<Home />} />
            <Route path='/resources' element={<Resources />} />
            <Route path='/about' element={<About/>}/>
            <Route path='/solutions' element={<Solutions/>}/>
            <Route path='/contact' element={<Contact/>}/>
          </Route>

          <Route path="/analyze" element={<AnalyzePage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
