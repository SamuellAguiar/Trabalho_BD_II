import axios from 'axios';

// Cria a conexão base
const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL, // Pega do arquivo .env
     timeout: 10000, // Se demorar mais de 10s, cancela (evita travar a tela)
     headers: {
          'Content-Type': 'application/json',
     },
});

// [OPCIONAL] Interceptor de Resposta
// Útil para tratar erros globais (ex: se o back cair, avisa o usuário)
api.interceptors.response.use(
     (response) => response,
     (error) => {
          if (error.code === "ERR_NETWORK") {
               console.error("❌ Erro de Conexão: O Back-end parece estar desligado.");
          }
          return Promise.reject(error);
     }
);

// Função auxiliar para montar URLs de imagem corretamente
export const getImageUrl = (path) => {
     if (!path) return '';

     // Se o caminho já começa com "http" (Cloudinary), retorna ele mesmo
     if (path.startsWith('http')) {
          return path;
     }

     // (Fallback) Se por acaso for uma imagem antiga local, mantém a lógica antiga
     // Ajuste a URL base conforme seu ambiente (localhost ou render)
     const BASE_URL = 'http://localhost:3010';
     return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default api;