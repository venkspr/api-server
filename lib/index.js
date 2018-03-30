const graphqlHTTP = require('express-graphql');
const express = require('express');

const graphqlGenerator = require('./graphql');
const mongoClientConnector = require('./mongo-client');

const app = express();

const runServer = async () => {
  const db = await mongoClientConnector();
  const { schema, rootValue } = graphqlGenerator(db);

  app.use(
    '/',
    graphqlHTTP({
      schema,
      rootValue,
      graphiql: process.env.NODE_ENV !== 'production',
    }),
  );

  app.listen(8888, () => {
    console.log('Server is running...');
  });
};

runServer();
