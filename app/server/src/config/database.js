// src/config/database.js
const { MongoClient } = require('mongodb');

class Database {
     constructor() {
          this.client = new MongoClient(process.env.MONGO_URI);
          this.db = null;
     }

     connect = async () => {
          if (!this.db) {
               try {
                    await this.client.connect();
                    this.db = this.client.db(process.env.DB_NAME);
                    return this.db;
               } catch (error) {
                    console.error("Erro ao conectar ao MongoDB:", error);
                    throw error;
               }
          }
          return this.db;
     }

     getDb = () => {
          if (!this.db) {
               throw new Error("Banco não conectado. Chame connect() primeiro.");
          }
          return this.db;
     }
}

module.exports = new Database();