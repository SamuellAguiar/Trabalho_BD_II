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
     if (!path) return null;
     // Se o caminho já vier completo (http...), retorna ele
     if (path.startsWith('http')) return path;

     // Senão, concatena com a URL do servidor
     // import.meta.env.VITE_IMG_URL = http://localhost:3010
     return `${import.meta.env.VITE_IMG_URL}${path}`;
};

export default api;