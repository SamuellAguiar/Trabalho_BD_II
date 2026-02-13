import axios from 'axios';

const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL, 
     timeout: 10000, 
     headers: {
          'Content-Type': 'application/json',
     },
});

api.interceptors.response.use(
     (response) => response,
     (error) => {
          if (error.code === "ERR_NETWORK") {
               console.error("❌ Erro de Conexão: O Back-end parece estar desligado.");
          }
          return Promise.reject(error);
     }
);

export const getImageUrl = (path) => {
     if (!path) return '';

     if (path.startsWith('http')) {
          return path;
     }

     const BASE_URL = 'http://localhost:3010';
     return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default api;