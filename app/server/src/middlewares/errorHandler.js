const errorHandler = (err, req, res, next) => {
     console.error("🔥 Erro:", err.stack); // Log no terminal para o desenvolvedor

     // Se for erro do Multer (arquivo muito grande, etc)
     if (err.name === 'MulterError') {
          return res.status(400).json({ erro: `Erro de upload: ${err.message}` });
     }

     // Erros genéricos
     const status = err.statusCode || 500;
     const message = err.message || 'Erro interno do servidor';

     res.status(status).json({ erro: message });
};

module.exports = errorHandler;