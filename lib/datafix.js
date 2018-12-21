const { MongoClient } = require('mongodb');

const config = require('./config');

module.exports = async function main() {
  let client;
  try {
    client = await MongoClient.connect(config.mongoDbUrl);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("We are connected");

  return client.db(config.mongodDbName);
};
