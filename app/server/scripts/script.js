require('dotenv').config();
const { MongoClient } = require('mongodb');

async function script() {
     const client = new MongoClient(process.env.MONGO_URI);

     try {
          await client.connect();
          console.log("Conectado ao MongoDB...");
          const db = client.db(process.env.DB_NAME);

          // LIMPEZA TOTAL (Reset)
          console.log("Limpando banco de dados...");
          await db.collection('setores').deleteMany({});
          await db.collection('categorias').deleteMany({});
          await db.collection('ocorrencias').deleteMany({});

          // CRIAÇÃO DE ÍNDICES (Performance e Busca)
          console.log("Criando índices...");
          await db.collection('ocorrencias').createIndex({ localizacao_geo: "2dsphere" });
          await db.collection('ocorrencias').createIndex({ Setor_REF: 1 });
          await db.collection('ocorrencias').createIndex({ Categoria_REF: 1 });
          await db.collection('setores').createIndex({ nome: 1 }, { unique: true });
          await db.collection('categorias').createIndex({ nome: 1 }, { unique: true });

          // INSERIR SETORES
          const setores = [
               { nome: "Estacionamento Principal" },
               { nome: "Biblioteca" },
               { nome: "Laboratório de Informática - Bloco C" },
               { nome: "Restaurante Universitário" },
               { nome: "Auditório" },
               { nome: "Ginásio de Esportes" },
               { nome: "Bloco H" },
               { nome: "Bloco E" },
               { nome: "Bloco A" },

          ];
          const resSetores = await db.collection('setores').insertMany(setores);

          const idSetores = Object.values(resSetores.insertedIds);
          console.log(`${resSetores.insertedCount} Setores inseridos.`);

          // INSERIR CATEGORIAS
          const categorias = [
               { nome: "Iluminação / Elétrica" },
               { nome: "Limpeza e Conservação" },
               { nome: "Segurança / Monitoramento" },
               { nome: "Infraestrutura Predial" },
               { nome: "Acessibilidade" }
          ];
          const resCategorias = await db.collection('categorias').insertMany(categorias);
          const idCategorias = Object.values(resCategorias.insertedIds);
          console.log(`${resCategorias.insertedCount} Categorias inseridas.`);

          // INSERIR OCORRÊNCIAS DE TESTE
          const ocorrencias = [
               {
                    descricao: "Poste de luz piscando intermitentemente, risco de queimar.",
                    data_hora: new Date("2025-11-25T19:00:00"),
                    status: "PENDENTE",
                    Setor_REF: idSetores[0],
                    Categoria_REF: idCategorias[0], 
                    localizacao_geo: { type: "Point", coordinates: [-43.9387, -19.9191] },
                    anexos: []
               },
               {
                    descricao: "Projetor não liga e ar condicionado fazendo barulho alto.",
                    data_hora: new Date("2025-11-26T08:30:00"),
                    status: "ANALISANDO",
                    Setor_REF: idSetores[2], 
                    Categoria_REF: idCategorias[0], 
                    localizacao_geo: { type: "Point", coordinates: [-43.9400, -19.9200] },
                    anexos: []
               },
               {
                    descricao: "Piso molhado sem sinalização, risco de queda.",
                    data_hora: new Date("2025-11-26T12:15:00"),
                    status: "RESOLVIDO",
                    Setor_REF: idSetores[3], 
                    Categoria_REF: idCategorias[1], 
                    localizacao_geo: { type: "Point", coordinates: [-43.9410, -19.9180] },
                    anexos: []
               }
          ];

          await db.collection('ocorrencias').insertMany(ocorrencias);
          console.log(`${ocorrencias.length} Ocorrências inseridas.`);

          // RELATÓRIO DE IDs
          console.log("\n=========================================");
          console.log(`SETOR ID (Estacionamento): ${idSetores[0]}`);
          console.log(`SETOR ID (Biblioteca):     ${idSetores[1]}`);
          console.log(`CATEGORIA ID (Iluminação): ${idCategorias[0]}`);
          console.log(`CATEGORIA ID (Limpeza):    ${idCategorias[1]}`);
          console.log("=========================================\n");

     } catch (error) {
          console.error("Erro no script:", error);
     } finally {
          await client.close();
          process.exit();
     }
}

script();