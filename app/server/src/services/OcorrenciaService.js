const OcorrenciaRepository = require('../repositories/OcorrenciaRepository');
const { ObjectId } = require('mongodb');
const { createPoint } = require('../utils/geoJsonHelper');

class OcorrenciaService {
     constructor(db) {
          this.ocorrenciaRepository = new OcorrenciaRepository(db);
          this.db = db;
     }

     async registrarNovaOcorrencia(dados, arquivos) {
          const idSetor = new ObjectId(dados.setorId);
          const idCategoria = new ObjectId(dados.categoriaId);

          const setorExiste = await this.db.collection('setores').findOne({ _id: idSetor });
          const categoriaExiste = await this.db.collection('categorias').findOne({ _id: idCategoria });

          if (!setorExiste) throw new Error("Setor não encontrado.");
          if (!categoriaExiste) throw new Error("Categoria não encontrada.");

          const listaAnexos = arquivos ? arquivos.map(file => ({
               caminho_arquivo: `/uploads/${file.filename}`,
               tipo: file.mimetype,
               nome_original: file.originalname
          })) : [];

          const novaOcorrencia = {
               descricao: dados.descricao,
               data_hora: new Date(),
               status: 'PENDENTE',
               Setor_REF: idSetor,
               Categoria_REF: idCategoria,
               localizacao_geo: createPoint(dados.lat, dados.lng),
               anexos: listaAnexos
          };

          return await this.ocorrenciaRepository.create(novaOcorrencia);
     }

     // --- CORREÇÃO PRINCIPAL AQUI ---
     async listarOcorrencias(filtros = {}) {
          const matchStage = {};

          // 1. Filtro de Busca Textual
          if (filtros.busca) {
               matchStage.$or = [
                    { descricao: { $regex: filtros.busca, $options: 'i' } }
                    // Nota: Filtrar por nome de setor/categoria exige lookup antes do match,
                    // mas para simplificar e não pesar, vamos filtrar pela descrição aqui.
               ];
          }

          // 2. Filtros de ID (Só aplica se tiver valor real, evita erro de string vazia)
          if (filtros.status) matchStage.status = filtros.status;

          if (filtros.categoriaId && filtros.categoriaId.length === 24) {
               matchStage.Categoria_REF = new ObjectId(filtros.categoriaId);
          }

          if (filtros.setorId && filtros.setorId.length === 24) {
               matchStage.Setor_REF = new ObjectId(filtros.setorId);
          }

          // 3. Filtro de Data (Novo)
          if (filtros.dataInicio || filtros.dataFim) {
               matchStage.data_hora = {};
               if (filtros.dataInicio) {
                    // Adiciona o horário T00:00:00 para pegar o início do dia
                    matchStage.data_hora.$gte = new Date(filtros.dataInicio + 'T00:00:00');
               }
               if (filtros.dataFim) {
                    // Adiciona o horário T23:59:59 para pegar o final do dia
                    matchStage.data_hora.$lte = new Date(filtros.dataFim + 'T23:59:59');
               }
          }

          // 4. Montar Pipeline com Joins ($lookup) para trazer os nomes
          const pipeline = [
               { $match: matchStage }, // Aplica os filtros
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
               // Projeta os campos finais para o Front-end
               {
                    $project: {
                         descricao: 1,
                         data_hora: 1,
                         status: 1,
                         localizacao_geo: 1,
                         anexos: 1,
                         nome_setor: { $arrayElemAt: ["$detalhes_setor.nome", 0] },
                         nome_categoria: { $arrayElemAt: ["$detalhes_categoria.nome", 0] },
                         // Mantemos os IDs caso precise
                         Setor_REF: 1,
                         Categoria_REF: 1
                    }
               },
               { $sort: { data_hora: -1 } } // Ordena do mais recente para o mais antigo
          ];

          // Executa a agregação direta na coleção
          return await this.db.collection('ocorrencias').aggregate(pipeline).toArray();
     }

     async buscarPorId(id) {
          if (!ObjectId.isValid(id)) throw new Error("ID inválido.");
          const ocorrencia = await this.ocorrenciaRepository.findById(id);
          if (!ocorrencia) throw new Error("Ocorrência não encontrada.");
          return ocorrencia;
     }

     async atualizarStatus(id, novoStatus) {
          if (!ObjectId.isValid(id)) throw new Error("ID inválido");
          return await this.ocorrenciaRepository.updateStatus(id, novoStatus);
     }

     async deletarOcorrencia(id) {
          if (!ObjectId.isValid(id)) throw new Error("ID inválido");
          return await this.ocorrenciaRepository.delete(id);
     }

     async removerAnexo(id, nomeArquivo) {
          // 1. Remove do Banco
          // O front vai mandar só o nome do arquivo (ex: "foto-123.jpg"), 
          // mas no banco está "/uploads/foto-123.jpg". Vamos ajustar:
          const caminhoCompletoNoBanco = `/uploads/${nomeArquivo}`;

          await this.ocorrenciaRepository.removeAnexo(id, caminhoCompletoNoBanco);

          // 2. Remove do Disco (Sistema de Arquivos)
          try {
               const caminhoFisico = path.join(process.cwd(), 'uploads', nomeArquivo);
               if (fs.existsSync(caminhoFisico)) {
                    fs.unlinkSync(caminhoFisico);
               }
          } catch (error) {
               console.error("Erro ao apagar arquivo físico:", error);
               // Não lançamos erro aqui para não travar a resposta, pois já saiu do banco
          }

          return { mensagem: "Anexo removido com sucesso." };
     }
}

module.exports = OcorrenciaService;