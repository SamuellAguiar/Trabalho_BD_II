const { ObjectId } = require('mongodb');

// Função auxiliar para criar GeoJSON
const createPoint = (lat, lng) => {
     const longitude = parseFloat(lng);
     const latitude = parseFloat(lat);

     if (isNaN(longitude) || isNaN(latitude)) {
          return null;
     }

     return {
          type: 'Point',
          coordinates: [longitude, latitude]
     };
};

class OcorrenciaService {
     constructor(db) {
          this.collection = db.collection('ocorrencias');
          this.setoresCollection = db.collection('setores');
          this.categoriasCollection = db.collection('categorias');
     }

     // --- CRIAR OCORRÊNCIA ---
     async criar(dados) {
          // 1. Validação de Setor e Categoria
          if (dados.setorId && dados.categoriaId) {
               const idSetor = new ObjectId(dados.setorId);
               const idCategoria = new ObjectId(dados.categoriaId);

               const setorExiste = await this.setoresCollection.findOne({ _id: idSetor });
               const categoriaExiste = await this.categoriasCollection.findOne({ _id: idCategoria });

               if (!setorExiste) throw new Error("Setor não encontrado.");
               if (!categoriaExiste) throw new Error("Categoria não encontrada.");

               dados.Setor_REF = idSetor;
               dados.Categoria_REF = idCategoria;

               delete dados.setorId;
               delete dados.categoriaId;
          }

          // 2. Tratamento da Localização (GeoJSON)
          if (dados.lat && dados.lng) {
               const geoPoint = createPoint(dados.lat, dados.lng);
               if (geoPoint) {
                    dados.localizacao_geo = geoPoint;
               }
               delete dados.lat;
               delete dados.lng;
          }

          // 3. DATAS (Alteração Principal)
          // data_criacao: Data exata que entrou no sistema (Para o Admin/Auditoria)
          dados.data_criacao = new Date();

          // data_ocorrencia: Data que o usuário diz que aconteceu (Para exibir publicamente)
          if (dados.data_ocorrencia) {
               dados.data_ocorrencia = new Date(dados.data_ocorrencia);
          }

          const resultado = await this.collection.insertOne(dados);

          return {
               _id: resultado.insertedId,
               ...dados
          };
     }

     // --- LISTAR OCORRÊNCIAS ---
     async listarOcorrencias(filtros = {}) {
          const matchStage = {};

          // Filtros
          if (filtros.busca) {
               matchStage.descricao = { $regex: filtros.busca, $options: 'i' };
          }
          if (filtros.status) matchStage.status = filtros.status;

          if (filtros.categoriaId && ObjectId.isValid(filtros.categoriaId)) {
               matchStage.Categoria_REF = new ObjectId(filtros.categoriaId);
          }

          if (filtros.setorId && ObjectId.isValid(filtros.setorId)) {
               matchStage.Setor_REF = new ObjectId(filtros.setorId);
          }

          // Filtro de Data 
          if (filtros.dataInicio || filtros.dataFim) {
               matchStage.data_criacao = {};
               if (filtros.dataInicio) {
                    matchStage.data_criacao.$gte = new Date(filtros.dataInicio + 'T00:00:00');
               }
               if (filtros.dataFim) {
                    matchStage.data_criacao.$lte = new Date(filtros.dataFim + 'T23:59:59');
               }
          }

          const pipeline = [
               { $match: matchStage },
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
                         data_criacao: 1,   
                         data_ocorrencia: 1, 
                         data_hora: 1,
                         status: 1,
                         localizacao_geo: 1,
                         anexos: 1,
                         nome_setor: { $arrayElemAt: ["$detalhes_setor.nome", 0] },
                         nome_categoria: { $arrayElemAt: ["$detalhes_categoria.nome", 0] },
                         Setor_REF: 1,
                         Categoria_REF: 1
                    }
               },
               { $sort: { data_criacao: -1 } } 
          ];

          return await this.collection.aggregate(pipeline).toArray();
     }

     async buscarPorId(id) {
          if (!ObjectId.isValid(id)) throw new Error("ID inválido");

          const pipeline = [
               { $match: { _id: new ObjectId(id) } },
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
                         data_criacao: 1,
                         data_ocorrencia: 1,
                         data_hora: 1,
                         status: 1,
                         localizacao_geo: 1,
                         anexos: 1,
                         nome_setor: { $arrayElemAt: ["$detalhes_setor.nome", 0] },
                         nome_categoria: { $arrayElemAt: ["$detalhes_categoria.nome", 0] },
                         Setor_REF: 1,
                         Categoria_REF: 1
                    }
               }
          ];

          const resultado = await this.collection.aggregate(pipeline).toArray();

          if (resultado.length === 0) throw new Error("Ocorrência não encontrada.");

          return resultado[0];
     }

     async atualizarStatus(id, novoStatus) {
          if (!ObjectId.isValid(id)) throw new Error("ID inválido");

          const resultado = await this.collection.updateOne(
               { _id: new ObjectId(id) },
               { $set: { status: novoStatus } }
          );

          if (resultado.matchedCount === 0) throw new Error("Ocorrência não encontrada");
          return resultado;
     }

     async deletarOcorrencia(id) {
          if (!ObjectId.isValid(id)) throw new Error("ID inválido");
          const resultado = await this.collection.deleteOne({ _id: new ObjectId(id) });
          if (resultado.deletedCount === 0) throw new Error("Ocorrência não encontrada");
          return resultado;
     }

     async removerAnexo(id, nomeArquivo) {
          if (!ObjectId.isValid(id)) throw new Error("ID inválido");
          const resultado = await this.collection.updateOne(
               { _id: new ObjectId(id) },
               {
                    $pull: {
                         anexos: { caminho_arquivo: { $regex: nomeArquivo } }
                    }
               }
          );
          return resultado;
     }
}

module.exports = OcorrenciaService;