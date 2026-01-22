import './App.css';
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from './context/AuthContext.jsx'


import Loader from "./components/Loader";
import LayoutWithNav from "./components/LayoutWithNav";
import Home from './components/Home';
import VerifyEmail from './components/VerifyEmail';
import Resources from './pages/Resources';
import About from './pages/About';
import Solutions from './pages/SolutionsPage';
import Contact from './pages/Contact';
import AnalyzePage from './pages/AnalyzePage';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location]);

  if (loading) return <Loader />;

  // Normally we would keep this return statement inside App() function but due to "useLocation()" which is used as a router, we need to keep the routing outside for it to render inside.
  return (
    <Routes>
      <Route element={<LayoutWithNav />}>
        <Route path="/" element={<Home />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/about" element={<About />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/analyze" element={<ProtectedRoute><AnalyzePage /></ProtectedRoute>} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
