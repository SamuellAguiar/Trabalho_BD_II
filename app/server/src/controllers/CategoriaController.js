const CategoriaService = require('../services/CategoriaService');
const dbInstance = require('../config/database');

class CategoriaController {

     _getService() {
          const db = dbInstance.getDb();
          return new CategoriaService(db);
     }

     criar = async (req, res) => {
          try {
               const service = this._getService();
               const resultado = await service.criar(req.body);
               return res.status(201).json(resultado);
          } catch (error) {
               return res.status(400).json({ erro: error.message });
          }
     }

     listar = async (req, res) => {
          try {
               const service = this._getService();
               const lista = await service.listar();
               return res.status(200).json(lista);
          } catch (error) {
               return res.status(500).json({ erro: error.message });
          }
     }

     atualizar = async (req, res) => {
          try {
               const service = this._getService();
               const { id } = req.params;
               await service.atualizar(id, req.body);
               return res.status(200).json({ mensagem: "Categoria atualizada com sucesso." });
          } catch (error) {
               return res.status(400).json({ erro: error.message });
          }
     }

     deletar = async (req, res) => {
          try {
               const service = this._getService();
               const { id } = req.params;
               await service.deletar(id);
               return res.status(200).json({ mensagem: "Categoria excluída com sucesso." });
          } catch (error) {
               if (error.message.includes('vinculadas')) {
                    return res.status(409).json({ erro: error.message });
               }
               return res.status(400).json({ erro: error.message });
          }
     }
}

module.exports = new CategoriaController();