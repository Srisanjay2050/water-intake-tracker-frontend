import axios from 'axios';
import { API_BASE_URL } from '../config';

const client = axios.create({ baseURL: API_BASE_URL });

// Attach the JWT access token (when present) to every outgoing request.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Collapse API/network errors into a plain Error with a readable message.
client.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err.response?.data;
    const message =
      data?.message ||
      data?.errors?.[0]?.message ||
      err.message ||
      'Request failed';
    return Promise.reject(new Error(message));
  }
);

export default client;
