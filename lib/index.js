const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const express = require('express');

// const app = express();

const { MongoClient, ObjectId } = require('mongodb');

const config = require('./config');

let db;

(async function main() {
  try {
    const client = await MongoClient.connect(config.mongoDbUrl);
    db = client.db(config.mongodDbName);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}());

const router = new express.Router();

const schema = buildSchema(`
  type Query {
    categories: [Category]
    products: [Product]
    category(_id: String!): Category
  }
  type Product {
    _id: String!
    CrossReference: String!
    ItemDescription: String
    Price: Int
    category: Category
  }
  type Category {
    _id: String!
    ProductLine: String!
    ProductSeries: String!
    products: [Product]
  }
`);

const resolveProductsWithCategory = async (products) => {
  const categories = await db
    .collection('categories')
    .find({ _id: { $in: products.map(product => product.CategoryId) } })
    .toArray();

  return products.map((product) => {
    const category = categories.find(item => item._id.toString() === product.CategoryId.toString());
    return {
      ...product,
      category,
    };
  });
};

const root = {
  products: () =>
    db
      .collection('products')
      .find()
      .toArray()
      .then(resolveProductsWithCategory),
  categories: () =>
    db
      .collection('categories')
      .find()
      .sort({ ProductLine: 1, ProductSeries: 1 })
      .toArray(),
  category: args =>
    db
      .collection('categories')
      .findOne({ _id: ObjectId(args._id) })
      .then(category => ({
        ...category,
        products: db
          .collection('products')
          .find({ CategoryId: ObjectId(args._id) })
          .toArray(),
      })),
};

router.use(
  '/',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  }),
);

app.listen(8888, () => {
  console.log('Server is running...');
});

module.exports = router;
