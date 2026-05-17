import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Цей код гарантує, що до КОЖНОГО запиту буде прикріплено токен авторизації
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // Перевіряємо, що токен є і він не дорівнює слову "undefined"
  if (token && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;