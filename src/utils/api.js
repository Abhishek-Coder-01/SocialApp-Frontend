import axios from 'axios';
import { beginApiRequest, endApiRequest, showApiNotice } from './apiStatus';
import { API_URL, isRenderApiHost } from './apiConfig';

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

    if (!error.response && isRenderApiHost()) {
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
