const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // <--- A LINHA QUE FALTAVA
const appRoutes = require('./routes/appRoutes');

const app = express();

// 1. Configuração do CORS
app.use(cors());

// 2. Parser de JSON
app.use(express.json());

// 3. MIDDLEWARE GLOBAL DE CABEÇALHOS
app.use((req, res, next) => {
     res.setHeader("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';");
     res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
     res.setHeader('Access-Control-Allow-Origin', '*');
     next();
});

/*
// 4. CONFIGURAÇÃO DE UPLOADS COM DEBUG
// Serve os arquivos estáticos e loga se houver erro
app.use('/uploads', (req, res, next) => {
     const pastaUploads = path.join(__dirname, '..', 'uploads'); // Sobe um nível para sair de 'src'
     const caminhoArquivo = path.join(pastaUploads, req.path);

     // Verifica se o arquivo existe (agora o fs vai funcionar)
     if (fs.existsSync(caminhoArquivo)) {
          console.log(`✅ Arquivo encontrado: ${req.path}`);
          next(); // Passa para o express.static entregar
     } else {
          console.error(`❌ Arquivo não encontrado no disco: ${caminhoArquivo}`);
          res.status(404).send('Arquivo não encontrado');
     }
}, express.static(path.join(__dirname, '..', 'uploads')));
*/
// 5. Rotas da API
app.use('/api', appRoutes);

// 6. Tratamento de Erros
app.use((err, req, res, next) => {
     console.error("Erro no servidor:", err);
     res.status(500).json({
          erro: "Ocorreu um erro interno no servidor.",
          detalhes: err.message
     });
});

module.exports = app;