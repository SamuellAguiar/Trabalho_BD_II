const dbInstance = require('../config/database');

class MetadadosController {
     async listarTudo(req, res, next) {
          try {
               const db = dbInstance.getDb();

               const [setores, categorias] = await Promise.all([
                    db.collection('setores').find({}).toArray(),
                    db.collection('categorias').find({}).toArray()
               ]);

               return res.status(200).json({
                    setores,
                    categorias
               });
          } catch (error) {
               next(error); 
          }
     }
}

module.exports = new MetadadosController();