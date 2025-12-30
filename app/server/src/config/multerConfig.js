const multer = require('multer');
const path = require('path');

// Configuração de onde salvar e qual nome dar
const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, 'uploads/'); // Pasta onde salva
     },
     filename: (req, file, cb) => {
          // Gera um nome único: timestamp + extensão original
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
     }
});

// Filtro de arquivos (apenas imagens)
const fileFilter = (req, file, cb) => {
     if (file.mimetype.startsWith('image/')) {
          cb(null, true);
     } else {
          cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
     }
};

const upload = multer({
     storage: storage,
     fileFilter: fileFilter,
     limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB
});

module.exports = upload;