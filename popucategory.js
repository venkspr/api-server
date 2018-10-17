const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'qc';

(async () => {
  const client = await MongoClient.connect(url);
  const db = client.db(dbName);

  const products = await db.collection('products').find().toArray();

  for (let product of products) {
    product.Price = Math.round(product.Price);
    console.log(product.CrossReference);
   var categories = await db.collection("categories").findOne(
      { 
          ProductSeries : product.CrossReference
      });
    console.log(categories);
    console.log(categories._id);
     product.CategoryId = categories._id;
    
        await db.collection('products').replaceOne({ _id: product._id }, product);
  }

  client.close();
})();