const graphqlHTTP = require('express-graphql');
const express = require('express');

const graphqlSchema = require('./graphql');
const mongoClientConnector = require('./mongo-client');

const app = express();

const runServer = async () => {
  const db = await mongoClientConnector();
  const { schema, rootValue } = graphqlSchema;

  app.use(
    '/',
    graphqlHTTP({
      schema,
      rootValue,
      context: { db },
      graphiql: process.env.NODE_ENV !== 'production',
    }),
  );

  app.listen(8888, () => {
    console.log('Server is running...');
  });
};

runServer();
