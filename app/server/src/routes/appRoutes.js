const express = require('express');
const router = express.Router();

// --- CONFIGURAÇÕES E MIDDLEWARES ---
const upload = require('../config/multerConfig');
const validateSchema = require('../middlewares/validateSchema');
const rateLimiter = require('../middlewares/rateLimiter');

// --- SCHEMAS DE VALIDAÇÃO ---
const ocorrenciaSchema = require('../schemas/ocorrenciaSchema');
const setorSchema = require('../schemas/setorSchema');        // Novo
const categoriaSchema = require('../schemas/categoriaSchema'); // Novo

// --- CONTROLLERS ---
const OcorrenciaController = require('../controllers/OcorrenciaController');
const SetorController = require('../controllers/SetorController');
const CategoriaController = require('../controllers/CategoriaController');
const MetadadosController = require('../controllers/MetadadosController');

// Aplicar Rate Limiter em todas as rotas da API (segurança contra spam/ataques)
router.use(rateLimiter);

// =========================================================
// ROTAS DE METADADOS (Auxiliar para o Front-end)
// =========================================================
router.get('/metadados', MetadadosController.listarTudo);

// =========================================================
// ROTAS DE OCORRÊNCIAS
// =========================================================
router.post('/ocorrencias',
     upload.array('fotos', 5),         // 1. Processa upload de imagens
     validateSchema(ocorrenciaSchema), // 2. Valida campos (lat, lng, desc)
     OcorrenciaController.registrar    // 3. Executa a lógica
);

router.get('/ocorrencias', OcorrenciaController.listar);

// Atualização de Status (ex: Pendente -> Resolvido)
router.patch('/ocorrencias/:id/status', OcorrenciaController.atualizarStatus);

router.get('/ocorrencias/:id', OcorrenciaController.buscarPorId);

router.delete('/ocorrencias/:id/fotos/:nomeArquivo', OcorrenciaController.removerAnexo);  

router.delete('/ocorrencias/:id', OcorrenciaController.deletar);

// =========================================================
// ROTAS DE SETORES
// =========================================================
router.post('/setores',
     validateSchema(setorSchema), // Adicionada validação na entrada
     SetorController.criar
);

router.get('/setores', SetorController.listar);

router.put('/setores/:id',
     validateSchema(setorSchema), // Adicionada validação na edição
     SetorController.atualizar
);

router.delete('/setores/:id', SetorController.deletar);

// =========================================================
// ROTAS DE CATEGORIAS
// =========================================================
router.post('/categorias',
     validateSchema(categoriaSchema), // Adicionada validação na entrada
     CategoriaController.criar
);

router.get('/categorias', CategoriaController.listar);

router.put('/categorias/:id',
     validateSchema(categoriaSchema), // Adicionada validação na edição
     CategoriaController.atualizar
);

router.delete('/categorias/:id', CategoriaController.deletar);

module.exports = router;