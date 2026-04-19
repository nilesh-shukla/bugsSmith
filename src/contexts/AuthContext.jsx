import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

function parseAxiosError(err) {
  if (!err) return 'Unknown error';
  // Prefer server response payloads
  const resp = err?.response?.data;
  if (!resp) return err?.message || String(err);
  if (typeof resp === 'string') return resp;
  if (typeof resp === 'object') {
    if (typeof resp.message === 'string' && resp.message.trim()) return resp.message;
    if (typeof resp.error === 'string' && resp.error.trim()) return resp.error;
    const maybeErrors = resp.errors || resp.error || resp.messages || resp.errorsList;
    if (Array.isArray(maybeErrors) && maybeErrors.length) {
      return maybeErrors
        .map(e => (typeof e === 'string' ? e : e?.message || JSON.stringify(e)))
        .join('; ');
    }
    if (typeof maybeErrors === 'object' && maybeErrors !== null) {
      try {
        const vals = Object.values(maybeErrors).flatMap(v => (Array.isArray(v) ? v : [v]));
        const msgs = vals.map(v => (typeof v === 'string' ? v : v?.message || JSON.stringify(v))).filter(Boolean);
        if (msgs.length) return msgs.join('; ');
      } catch (e) {
        // fall through
      }
    }
    try {
      return JSON.stringify(resp);
    } catch (e) {
      return String(resp);
    }
  }
  return String(resp);
}

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
      const message = parseAxiosError(err) || 'Login failed';
      console.error('Auth login error:', message, err);
      throw new Error(message);
    }
  };

  const signup = async ({ firstName, lastName, email, password, cpassword, role }) => {
    try {
      const res = await axiosInstance.post('/api/auth/register', { firstName, lastName, email, password, cpassword, role });
      return res.data;
    } catch (err) {
      const message = parseAxiosError(err) || 'Signup failed';
      console.error('Auth signup error:', message, err);
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
