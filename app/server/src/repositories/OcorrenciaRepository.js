const { ObjectId } = require('mongodb');

class OcorrenciaRepository {
     constructor(db) {
          this.collection = db.collection('ocorrencias');
     }

     async create(dadosOcorrencia) {
          return await this.collection.insertOne(dadosOcorrencia);
     }

     async findFiltered(filtros) {
          const query = {};

          // Filtro por status 
          if (filtros.status) {
               query.status = filtros.status;
          }

          // Filtro por categoria (ID)
          if (filtros.categoriaId) {
               query.Categoria_REF = new ObjectId(filtros.categoriaId);
          }

          // Filtro por setor (ID)
          if (filtros.setorId) {
               query.Setor_REF = new ObjectId(filtros.setorId);
          }

          // Filtro por palavra-chave na descrição 
          if (filtros.busca) {
               query.descricao = { $regex: filtros.busca, $options: 'i' };
          }

          // AGGREGATION PIPELINE 
          const pipeline = [
               { $match: query }, 
               {
                    $lookup: {
                         from: 'setores',          
                         localField: 'Setor_REF',  
                         foreignField: '_id',      
                         as: 'detalhes_setor'      
                    }
               },
               {
                    $lookup: {
                         from: 'categorias',
                         localField: 'Categoria_REF',
                         foreignField: '_id',
                         as: 'detalhes_categoria'
                    }
               },
               {
                    $project: {
                         descricao: 1,
                         data_hora: 1,
                         status: 1,
                         localizacao_geo: 1,
                         anexos: 1,
                         nome_setor: { $arrayElemAt: ["$detalhes_setor.nome", 0] },
                         nome_categoria: { $arrayElemAt: ["$detalhes_categoria.nome", 0] }
                    }
               }
          ];

          return await this.collection.aggregate(pipeline).toArray();
     }
     async updateStatus(id, novoStatus) {
          return await this.collection.updateOne(
               { _id: new ObjectId(id) },
               { $set: { status: novoStatus } }
          );
     }

     async delete(id) {
          return await this.collection.deleteOne({ _id: new ObjectId(id) });
     }
     
     async findById(id) {
          const pipeline = [
               { $match: { _id: new ObjectId(id) } },
               {
                    $lookup: { from: 'setores', localField: 'Setor_REF', foreignField: '_id', as: 'detalhes_setor' }
               },
               {
                    $lookup: { from: 'categorias', localField: 'Categoria_REF', foreignField: '_id', as: 'detalhes_categoria' }
               },
               {
                    $project: {
                         descricao: 1, data_hora: 1, status: 1, localizacao_geo: 1, anexos: 1,
                         nome_setor: { $arrayElemAt: ["$detalhes_setor.nome", 0] },
                         nome_categoria: { $arrayElemAt: ["$detalhes_categoria.nome", 0] }
                    }
               }
          ];
          const result = await this.collection.aggregate(pipeline).toArray();
          return result[0]; 
     }

     async removeAnexo(idOcorrencia, caminhoArquivo) {
          return await this.collection.updateOne(
               { _id: new ObjectId(idOcorrencia) },
               { $pull: { anexos: { caminho_arquivo: caminhoArquivo } } }
          );
     }
}

module.exports = OcorrenciaRepository;