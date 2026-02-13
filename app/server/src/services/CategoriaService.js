const CategoriaRepository = require('../repositories/CategoriaRepository');
const { ObjectId } = require('mongodb');

class CategoriaService {
     constructor(db) {
          this.categoriaRepository = new CategoriaRepository(db);
          this.ocorrenciaCollection = db.collection('ocorrencias');
     }

     async criar(dados) {
          if (!dados.nome || dados.nome.length < 3) {
               throw new Error("O nome da categoria deve ter no mínimo 3 caracteres.");
          }

          const existe = await this.categoriaRepository.findByName(dados.nome);
          if (existe) {
               throw new Error("Já existe uma categoria cadastrada com este nome.");
          }

          return await this.categoriaRepository.create({ nome: dados.nome });
     }

     async listar() {
          return await this.categoriaRepository.findAll();
     }

     async atualizar(id, dados) {
          if (!dados.nome) throw new Error("O nome é obrigatório.");

          if (!ObjectId.isValid(id)) throw new Error("ID inválido.");

          return await this.categoriaRepository.update(id, { nome: dados.nome });
     }

     async deletar(id) {
          if (!ObjectId.isValid(id)) throw new Error("ID inválido.");

          const ocorrenciasVinculadas = await this.ocorrenciaCollection.countDocuments({
               Categoria_REF: new ObjectId(id)
          });

          if (ocorrenciasVinculadas > 0) {
               throw new Error(`Não é possível excluir esta categoria pois existem ${ocorrenciasVinculadas} ocorrências vinculadas a ela.`);
          }

          const resultado = await this.categoriaRepository.delete(id);
          if (resultado.deletedCount === 0) {
               throw new Error("Categoria não encontrada para exclusão.");
          }
          return resultado;
     }
}

module.exports = CategoriaService;