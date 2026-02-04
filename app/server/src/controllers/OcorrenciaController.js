// src/controllers/OcorrenciaController.js
const OcorrenciaService = require('../services/OcorrenciaService');
const dbInstance = require('../config/database');

class OcorrenciaController {
     async criar(req, res, next) {
          try {
               const db = dbInstance.getDb();
               const service = new OcorrenciaService(db);

               // Monta o array de anexos pegando a URL que o Cloudinary devolveu
               let anexos = [];
               if (req.files && req.files.length > 0) {
                    anexos = req.files.map(file => ({
                         caminho_arquivo: file.path, // <--- AQUI ESTÁ O SEGREDO! O path agora é uma URL https://...
                         tipo_arquivo: file.mimetype
                    }));
               }

               const dadosOcorrencia = {
                    ...req.body,
                    anexos: anexos, // Salva o array com links do Cloudinary
                    status: 'PENDENTE',
                    data_hora: new Date()
               };

               const novaOcorrencia = await service.criar(dadosOcorrencia);
               return res.status(201).json(novaOcorrencia);

          } catch (error) {
               next(error);
          }
     }

     async listar(req, res) {
          try {
               const db = dbInstance.getDb();
               const ocorrenciaService = new OcorrenciaService(db);

               const ocorrencias = await ocorrenciaService.listarOcorrencias(req.query);
               return res.status(200).json(ocorrencias);
          } catch (error) {
               return res.status(500).json({ erro: "Erro ao buscar ocorrências." });
          }
     }


     async atualizarStatus(req, res) {
          try {
               const db = dbInstance.getDb();
               const service = new OcorrenciaService(db);
               const { id } = req.params;
               const { status } = req.body; // Espera receber { "status": "RESOLVIDO" }

               await service.atualizarStatus(id, status);
               return res.status(200).json({ mensagem: "Status atualizado com sucesso!" });
          } catch (error) {
               return res.status(400).json({ erro: error.message });
          }
     }

     async buscarPorId(req, res, next) {
          try {
               const db = dbInstance.getDb();
               const service = new OcorrenciaService(db);
               const { id } = req.params;

               const ocorrencia = await service.buscarPorId(id);
               return res.status(200).json(ocorrencia);
          } catch (error) {
               next(error);
          }
     }

     async removerAnexo(req, res, next) {
          try {
               const db = dbInstance.getDb();
               const service = new OcorrenciaService(db);
               const { id, nomeArquivo } = req.params; // Vamos passar o nome na URL

               await service.removerAnexo(id, nomeArquivo);
               return res.status(200).json({ mensagem: "Foto removida." });
          } catch (error) {
               next(error);
          }
     }

     async deletar(req, res) {
          try {
               const db = dbInstance.getDb();
               const service = new OcorrenciaService(db);
               const { id } = req.params;

               await service.deletarOcorrencia(id);
               return res.status(200).json({ mensagem: "Ocorrência excluída com sucesso." });
          } catch (error) {
               return res.status(400).json({ erro: error.message });
          }
     }
}

module.exports = new OcorrenciaController();