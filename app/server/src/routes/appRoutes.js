const express = require('express');
const router = express.Router();
const upload = require('../config/upload');

// --- CONFIGURAÇÕES E MIDDLEWARES ---
const validateSchema = require('../middlewares/validateSchema');
const rateLimiter = require('../middlewares/rateLimiter');

// --- SCHEMAS DE VALIDAÇÃO ---
const ocorrenciaSchema = require('../schemas/ocorrenciaSchema');
const setorSchema = require('../schemas/setorSchema');        
const categoriaSchema = require('../schemas/categoriaSchema'); 

// --- CONTROLLERS ---
const OcorrenciaController = require('../controllers/OcorrenciaController');
const SetorController = require('../controllers/SetorController');
const CategoriaController = require('../controllers/CategoriaController');
const MetadadosController = require('../controllers/MetadadosController');

router.use(rateLimiter);

// =========================================================
// ROTAS DE METADADOS 
router.get('/metadados', MetadadosController.listarTudo);

// =========================================================
// ROTAS DE OCORRÊNCIAS
router.post('/ocorrencias', upload.array('fotos', 5), OcorrenciaController.criar);

router.get('/ocorrencias', OcorrenciaController.listar);

// Atualização de Status (ex: Pendente -> Resolvido)
router.patch('/ocorrencias/:id/status', OcorrenciaController.atualizarStatus);

router.get('/ocorrencias/:id', OcorrenciaController.buscarPorId);

router.delete('/ocorrencias/:id/fotos/:nomeArquivo', OcorrenciaController.removerAnexo);

router.delete('/ocorrencias/:id', OcorrenciaController.deletar);

// =========================================================
// ROTAS DE SETORES
router.post('/setores',
     validateSchema(setorSchema), 
     SetorController.criar
);

router.get('/setores', SetorController.listar);

router.put('/setores/:id',
     validateSchema(setorSchema), 
     SetorController.atualizar
);

router.delete('/setores/:id', SetorController.deletar);

// =========================================================
// ROTAS DE CATEGORIAS
router.post('/categorias',
     validateSchema(categoriaSchema), 
     CategoriaController.criar
);

router.get('/categorias', CategoriaController.listar);

router.put('/categorias/:id',
     validateSchema(categoriaSchema), 
     CategoriaController.atualizar
);

router.delete('/categorias/:id', CategoriaController.deletar);

module.exports = router;