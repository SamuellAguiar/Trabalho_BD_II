const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Configura o Cloudinary com as chaves
cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Define o Storage 
const storage = new CloudinaryStorage({
     cloudinary: cloudinary,
     params: {
          folder: 'sentinel_uploads', 
          allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], 
     },
});

// 3. Cria o middleware do Multer
const upload = multer({ storage: storage });

module.exports = upload;