const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path'); // Importar path
const appRoutes = require('./routes/appRoutes');
const errorHandler = require('./middlewares/errorHandler'); // Importar error handler

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (As imagens)
// Acessível via: http://localhost:3010/uploads/nome-da-foto.jpg
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', appRoutes);

// O Error Handler deve ser SEMPRE o último middleware
app.use(errorHandler);

module.exports = app;