const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'qc';

(async () => {
  const client = await MongoClient.connect(url);
  const db = client.db(dbName);

  const products = await db.collection('products').find().toArray();

  for (let product of products) {
    product.Price = Math.floor((Math.random() * 1000+19)*100);
        await db.collection('products').replaceOne({ _id: product._id }, product);
  }

  client.close();
})();