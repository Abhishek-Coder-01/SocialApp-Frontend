import axios from 'axios';
import { beginApiRequest, endApiRequest, showApiNotice } from './apiStatus';

// Base API URL from environment variable, fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base config
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Request interceptor: attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    beginApiRequest();
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle auth errors globally
api.interceptors.response.use(
  (response) => {
    endApiRequest();
    return response;
  },
  (error) => {
    endApiRequest();

    if (!error.response && /render\.com|onrender\.com/i.test(API_URL)) {
      showApiNotice('Render server is waking up. Please wait a moment.');
    }

    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
