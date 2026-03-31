import './App.css';
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Loader from "./components/Loader";
import LayoutWithNav from "./components/LayoutWithNav";
import Home from './components/Home';
import Resources from './pages/Resources';
import About from './pages/About';
import Solutions from './pages/SolutionsPage';
import Contact from './pages/Contact';
import AnalyzePage from './pages/AnalyzePage';
import AuthLanding from './pages/AuthLanding';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './contexts/AuthContext';

function AppRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location]);

  if (loading) return <Loader />;

  // Normally we would keep this return statement inside App() function but due to "useLocation()" which is used as a router, we need to keep the rouoting outside for it to render inside.
  return (
    <Routes>
      {/* Public auth landing and nested auth pages */}
      <Route path="/auth" element={<AuthLanding/>} />
      <Route path="/auth/login" element={<Login/>} />
      <Route path="/auth/signup" element={<Signup/>} />
      <Route element={<LayoutWithNav />}>
        <Route path="/" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/about" element={<About />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/analyze" element={<AnalyzePage />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
