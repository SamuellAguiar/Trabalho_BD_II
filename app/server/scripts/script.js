const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

if (!uri) {
     console.error("❌ Erro: MONGO_URI não definido no .env");
     process.exit(1);
}

async function script() {
     const client = new MongoClient(uri);

     try {
          await client.connect();
          console.log(`🔌 Conectado ao MongoDB [${dbName}]...`);
          const db = client.db(dbName);

          // --- 1. LIMPEZA TOTAL ---
          console.log("🧹 Limpando coleções antigas...");
          await db.collection('setores').deleteMany({});
          await db.collection('categorias').deleteMany({});
          await db.collection('ocorrencias').deleteMany({});

          // --- 2. CRIAÇÃO DE ÍNDICES ---
          console.log("⚡ Criando índices de performance...");
          await db.collection('ocorrencias').createIndex({ localizacao_geo: "2dsphere" });
          await db.collection('ocorrencias').createIndex({ Setor_REF: 1 });
          await db.collection('ocorrencias').createIndex({ Categoria_REF: 1 });
          await db.collection('ocorrencias').createIndex({ data_criacao: -1 }); // Para ordenar por mais recente

          // --- 3. INSERIR SETORES ---
          console.log("asd Inserindo Setores...");
          const listaSetores = [
               { nome: "Estacionamento Principal" },
               { nome: "Biblioteca Central" },
               { nome: "Laboratório de Informática - Bloco C" },
               { nome: "Restaurante Universitário" },
               { nome: "Auditório" },
               { nome: "Ginásio de Esportes" },
               { nome: "Bloco H - Administrativo" },
               { nome: "Bloco E - Salas de Aula" },
               { nome: "Bloco A - Engenharias" },
               { nome: "Centro de Convivência" }
          ];

          const resSetores = await db.collection('setores').insertMany(listaSetores);

          const setoresMap = {};
          const setoresDocs = await db.collection('setores').find().toArray();
          setoresDocs.forEach(doc => setoresMap[doc.nome] = doc._id);

          // --- 4. INSERIR CATEGORIAS ---
          console.log("🏷️  Inserindo Categorias...");
          const listaCategorias = [
               { nome: "Iluminação / Elétrica" },
               { nome: "Limpeza e Conservação" },
               { nome: "Segurança / Monitoramento" },
               { nome: "Infraestrutura Predial" },
               { nome: "Acessibilidade" },
               { nome: "Equipamentos / Mobiliário" }
          ];

          await db.collection('categorias').insertMany(listaCategorias);

          const catMap = {};
          const catDocs = await db.collection('categorias').find().toArray();
          catDocs.forEach(doc => catMap[doc.nome] = doc._id);

          // --- 5. INSERIR OCORRÊNCIAS ---
          console.log("📝 Inserindo Ocorrências de Teste...");

          const ocorrencias = [
               {
                    descricao: "Lâmpada do poste queimada, deixando a área muito escura à noite.",
                    data_criacao: new Date("2026-01-12T09:30:00.000Z"),
                    data_ocorrencia: new Date("2026-01-11T20:10:00.000Z"),
                    status: "PENDENTE",
                    Setor_REF: setoresMap["Estacionamento Principal"],
                    Categoria_REF: catMap["Iluminação / Elétrica"],
                    localizacao_geo: { type: "Point", coordinates: [-43.5085, -20.3982] },
                    anexos: []
               },
               {
                    descricao: "Projetor da sala 204 não liga e o ar condicionado está pingando muito.",
                    data_criacao: new Date("2026-01-28T14:45:00.000Z"),
                    data_ocorrencia: new Date("2026-01-28T13:50:00.000Z"),
                    status: "ANALISANDO",
                    Setor_REF: setoresMap["Bloco E - Salas de Aula"],
                    Categoria_REF: catMap["Equipamentos / Mobiliário"],
                    localizacao_geo: { type: "Point", coordinates: [-43.5090, -20.3990] },
                    anexos: [
                         {
                              caminho_arquivo: "/Exemplo.png",
                              tipo_arquivo: "image/png"
                         }
                    ]
               },
               {
                    descricao: "Piso molhado sem sinalização perto da catraca, risco alto de queda.",
                    data_criacao: new Date("2025-12-30T11:15:00.000Z"),
                    data_ocorrencia: new Date("2025-12-30T10:55:00.000Z"),
                    status: "RESOLVIDO",
                    Setor_REF: setoresMap["Restaurante Universitário"],
                    Categoria_REF: catMap["Limpeza e Conservação"],
                    localizacao_geo: { type: "Point", coordinates: [-43.5075, -20.3975] },
                    anexos: []
               },
               {
                    descricao: "Vidro da janela quebrado após ventania forte.",
                    data_criacao: new Date("2026-02-03T08:20:00.000Z"),
                    data_ocorrencia: null,
                    status: "PENDENTE",
                    Setor_REF: setoresMap["Biblioteca Central"],
                    Categoria_REF: catMap["Infraestrutura Predial"],
                    localizacao_geo: { type: "Point", coordinates: [-43.5080, -20.3985] },
                    anexos: [
                         {
                              caminho_arquivo: "/Exemplo01.png",
                              tipo_arquivo: "image/png"
                         }
                    ]
               }
          ];

          await db.collection('ocorrencias').insertMany(ocorrencias);

          console.log(`✅ Sucesso! Foram inseridas:`);
          console.log(`   - ${listaSetores.length} Setores`);
          console.log(`   - ${listaCategorias.length} Categorias`);
          console.log(`   - ${ocorrencias.length} Ocorrências`);

     } catch (error) {
          console.error("❌ Erro fatal no script:", error);
     } finally {
          await client.close();
          console.log("👋 Conexão encerrada.");
          process.exit(0);
     }
}

script();