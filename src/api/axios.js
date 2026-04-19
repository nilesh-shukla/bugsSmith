import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // include httpOnly refresh cookie for refresh calls
});

// attach access token to outgoing requests
instance.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {}
  return config;
});

// response interceptor to refresh token on 401 and retry
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // call refresh endpoint using plain axios to avoid interceptor loop
        const refreshRes = await axios.post(`${API_URL}/api/auth/refresh`, {}, { withCredentials: true });
        const newAccess = refreshRes?.data?.data?.tokens?.accessToken;
        if (newAccess) {
          try { localStorage.setItem('accessToken', newAccess); } catch (e) {}
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return instance(originalRequest);
        }
      } catch (e) {
        try { localStorage.removeItem('accessToken'); localStorage.removeItem('user'); } catch (er) {}
        // redirect to login page
        if (typeof window !== 'undefined') window.location.href = '/auth/login';
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
