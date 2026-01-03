const dbInstance = require('../config/database');

class MetadadosController {
     async listarTudo(req, res, next) {
          try {
               const db = dbInstance.getDb();

               // Busca paralela para ser mais rápido
               const [setores, categorias] = await Promise.all([
                    db.collection('setores').find({}).toArray(),
                    db.collection('categorias').find({}).toArray()
               ]);

               return res.status(200).json({
                    setores,
                    categorias
               });
          } catch (error) {
               next(error); // Passa para o errorHandler
          }
     }
}

module.exports = new MetadadosController();