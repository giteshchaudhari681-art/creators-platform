import axios from 'axios';
import { resolveApiOrigin } from './backend';

const api = axios.create({
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const resolvedOrigin = await resolveApiOrigin();
  const nextConfig = { ...config };

  nextConfig.baseURL = resolvedOrigin;

  if (nextConfig.data && !(nextConfig.data instanceof FormData)) {
    nextConfig.headers['Content-Type'] = 'application/json';
  } else {
    delete nextConfig.headers['Content-Type'];
  }

  const token = localStorage.getItem('token');
  if (token) {
    nextConfig.headers.Authorization = `Bearer ${token}`;
  }

  return nextConfig;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
