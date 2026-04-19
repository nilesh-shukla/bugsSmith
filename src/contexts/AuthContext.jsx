import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const login = async ({ email, password }) => {
    try {
      const res = await axiosInstance.post('/api/auth/login', { email, password });
      const data = res.data;
      try { 
        localStorage.setItem('accessToken', data.data.tokens.accessToken);
      } catch (e) {}
      // refresh token is stored in httpOnly cookie by server
      try { 
        localStorage.setItem('user', JSON.stringify(data.data.user)); 
      } catch (e) {}
      setUser(data.data.user);
      return data.data;
    } catch (err) {
      console.log(err);
      const message = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Login failed';
      throw new Error(message);
    }
  };

  const signup = async ({ firstName, lastName, email, password, cpassword, role }) => {
    try {
      const res = await axiosInstance.post('/api/auth/register', { firstName, lastName, email, password, cpassword, role });
      return res.data;
    } catch (err) {
      const message = err?.response?.data?.message || err?.response?.data?.error || err.message || 'Signup failed';
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      // backend clears the refresh token cookie (httpOnly) on /api/auth/logout
      await axiosInstance.get('/api/auth/logout');
    } catch (e) {
      // ignore network errors
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    try {
      // Redirect to login and reload to ensure protected routes re-evaluate
      navigate('/auth/login', { replace: true });
    } catch (e) {
      // ignore navigation errors
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
