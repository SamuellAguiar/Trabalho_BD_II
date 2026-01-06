const { ObjectId } = require('mongodb');

class OcorrenciaRepository {
     constructor(db) {
          this.collection = db.collection('ocorrencias');
     }

     async create(dadosOcorrencia) {
          // Insere usando o driver nativo
          return await this.collection.insertOne(dadosOcorrencia);
     }

     async findFiltered(filtros) {
          const query = {};

          // Filtro por status (exato)
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

          // Filtro por palavra-chave na descrição (Regex - busca parcial)
          if (filtros.busca) {
               query.descricao = { $regex: filtros.busca, $options: 'i' };
          }

          // AGGREGATION PIPELINE (O "Join" do NoSQL)
          // Isso é essencial para mostrar o NOME do setor e não só o ID na tela
          const pipeline = [
               { $match: query }, // Aplica os filtros acima
               {
                    $lookup: {
                         from: 'setores',          // Coleção alvo
                         localField: 'Setor_REF',  // Campo na ocorrência
                         foreignField: '_id',      // Campo no setor
                         as: 'detalhes_setor'      // Onde vai guardar o resultado
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
               // O lookup retorna um array, vamos pegar o primeiro item (unwind)
               // ou projetar apenas os nomes para facilitar o front-end
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
          // Precisamos do lookup aqui também para trazer os nomes de setor/categoria
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
          return result[0]; // Retorna o primeiro (e único) item
     }

     async removeAnexo(idOcorrencia, caminhoArquivo) {
          // $pull remove um item de um array que corresponda à condição
          return await this.collection.updateOne(
               { _id: new ObjectId(idOcorrencia) },
               { $pull: { anexos: { caminho_arquivo: caminhoArquivo } } }
          );
     }
}

module.exports = OcorrenciaRepository;