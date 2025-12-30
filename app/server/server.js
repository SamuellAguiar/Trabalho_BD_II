// server.js
require('dotenv').config();
const app = require('./src/app');
const db = require('./src/config/database'); // Aqui db é a instância de Database

const PORT = process.env.PORT || 3010;

async function startServer() {
     try {
          // Agora o método connect() deve ser reconhecido
          await db.connect();

          app.listen(PORT, () => {
               console.log(`🚀 Servidor rodando na porta ${PORT}`);
               console.log(`✅ Conexão com MongoDB Atlas estabelecida.`);
          });
     } catch (error) {
          console.error('❌ Falha ao iniciar o servidor:', error.message);
          process.exit(1);
     }
}

startServer();