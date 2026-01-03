const multer = require('multer');
const path = require('path');
const fs = require('fs');

// USAR process.cwd() É MAIS SEGURO NO RENDER
// Ele pega exatamente a pasta onde o comando 'node server.js' foi rodado
const uploadDir = path.join(process.cwd(), 'uploads');

// Se a pasta não existir, cria ela agora!
if (!fs.existsSync(uploadDir)) {
     try {
          fs.mkdirSync(uploadDir, { recursive: true });
          console.log(`✅ Pasta criada com sucesso: ${uploadDir}`);
     } catch (err) {
          console.error("❌ Erro ao criar pasta uploads:", err);
     }
}

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, uploadDir);
     },
     filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
     }
});

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
     limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;