const OcorrenciaRepository = require('../repositories/OcorrenciaRepository');
const { ObjectId } = require('mongodb');
const { createPoint } = require('../utils/geoJsonHelper');

class OcorrenciaService {
     constructor(db) {
          this.ocorrenciaRepository = new OcorrenciaRepository(db);
          this.db = db;
     }

     // Recebe 'arquivos' agora também (array de objetos do Multer)
     async registrarNovaOcorrencia(dados, arquivos) {
          // Validação de Integridade (IDs)
          const idSetor = new ObjectId(dados.setorId);
          const idCategoria = new ObjectId(dados.categoriaId);

          const setorExiste = await this.db.collection('setores').findOne({ _id: idSetor });
          const categoriaExiste = await this.db.collection('categorias').findOne({ _id: idCategoria });

          if (!setorExiste) throw new Error("Setor não encontrado.");
          if (!categoriaExiste) throw new Error("Categoria não encontrada.");

          // Processar os arquivos recebidos pelo Multer
          const listaAnexos = arquivos ? arquivos.map(file => ({
               caminho_arquivo: `/uploads/${file.filename}`, // Caminho relativo para acessar depois
               tipo: file.mimetype,
               nome_original: file.originalname
          })) : [];

          // Montar objeto final
          const novaOcorrencia = {
               descricao: dados.descricao,
               data_hora: new Date(),
               status: 'PENDENTE',
               Setor_REF: idSetor,
               Categoria_REF: idCategoria,

               // Usando o Helper
               localizacao_geo: createPoint(dados.lat, dados.lng),

               anexos: listaAnexos
          };

          return await this.ocorrenciaRepository.create(novaOcorrencia);
     }

     async listarOcorrencias(filtros) {
          return await this.ocorrenciaRepository.findFiltered(filtros);
     }

     // ... métodos anteriores ...

     async atualizarStatus(id, status) {
          const statusValidos = ['PENDENTE', 'ANALISANDO', 'RESOLVIDO'];

          if (!statusValidos.includes(status)) {
               throw new Error(`Status inválido. Permitidos: ${statusValidos.join(', ')}`);
          }

          if (!ObjectId.isValid(id)) throw new Error("ID inválido.");

          const resultado = await this.ocorrenciaRepository.updateStatus(id, status);

          if (resultado.matchedCount === 0) {
               throw new Error("Ocorrência não encontrada.");
          }
          return resultado;
     }

     async deletarOcorrencia(id) {
          if (!ObjectId.isValid(id)) throw new Error("ID inválido.");

          const resultado = await this.ocorrenciaRepository.delete(id);

          if (resultado.deletedCount === 0) {
               throw new Error("Ocorrência não encontrada.");
          }
          return resultado;
     }
}

module.exports = OcorrenciaService;