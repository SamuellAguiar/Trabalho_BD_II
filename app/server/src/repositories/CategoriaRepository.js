const { ObjectId } = require('mongodb');

class CategoriaRepository {
     constructor(db) {
          this.collection = db.collection('categorias');
     }

     async create(dados) {
          return await this.collection.insertOne(dados);
     }

     async findAll() {
          return await this.collection.find({}).toArray();
     }

     async findById(id) {
          return await this.collection.findOne({ _id: new ObjectId(id) });
     }

     async findByName(nome) {
          // Busca insensível a maiúsculas/minúsculas (Case Insensitive)
          return await this.collection.findOne({ nome: { $regex: new RegExp(`^${nome}$`, 'i') } });
     }

     async update(id, dados) {
          return await this.collection.updateOne(
               { _id: new ObjectId(id) },
               { $set: dados }
          );
     }

     async delete(id) {
          return await this.collection.deleteOne({ _id: new ObjectId(id) });
     }
}

module.exports = CategoriaRepository;