const SetorRepository = require('../repositories/SetorRepository');
const { ObjectId } = require('mongodb');

class SetorService {
     constructor(db) {
          this.setorRepository = new SetorRepository(db);
          this.ocorrenciaCollection = db.collection('ocorrencias'); // Necessário para verificar vínculos
     }

     async criar(dados) {
          if (!dados.nome || dados.nome.length < 3) {
               throw new Error("O nome do setor deve ter no mínimo 3 caracteres.");
          }

          const existe = await this.setorRepository.findByName(dados.nome);
          if (existe) {
               throw new Error("Já existe um setor cadastrado com este nome.");
          }

          return await this.setorRepository.create({ nome: dados.nome });
     }

     async listar() {
          return await this.setorRepository.findAll();
     }

     async atualizar(id, dados) {
          if (!dados.nome) throw new Error("O nome é obrigatório.");

          // Verifica se o ID é válido
          if (!ObjectId.isValid(id)) throw new Error("ID inválido.");

          return await this.setorRepository.update(id, { nome: dados.nome });
     }

     async deletar(id) {
          if (!ObjectId.isValid(id)) throw new Error("ID inválido.");

          // REGRA DE OURO: Integridade Referencial Manual
          // Verifica se existe alguma ocorrência usando este setor antes de apagar
          const ocorrenciasVinculadas = await this.ocorrenciaCollection.countDocuments({
               Setor_REF: new ObjectId(id)
          });

          if (ocorrenciasVinculadas > 0) {
               throw new Error(`Não é possível excluir este setor pois existem ${ocorrenciasVinculadas} ocorrências vinculadas a ele.`);
          }

          const resultado = await this.setorRepository.delete(id);
          if (resultado.deletedCount === 0) {
               throw new Error("Setor não encontrado para exclusão.");
          }
          return resultado;
     }
}

module.exports = SetorService;