const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'qc';

(async () => {
  const client = await MongoClient.connect(url);
  const db = client.db(dbName);

  const products = await db.collection('products').find().toArray();

  for (let product of products) {
    product.Price = Math.round(product.Price);
     product.CategoryId = product.CatgegoryId;
     delete product.CatgegoryId;
    await db.collection('products').replaceOne({ _id: product._id }, product);
  }

  client.close();
})();