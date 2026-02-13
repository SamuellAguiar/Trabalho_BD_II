const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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

// 4. Rotas da API
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