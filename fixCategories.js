const { MongoClient, ObjectID } = require('mongodb');
const url = 'mongodb://apiadmin:welcome123@ds157349.mlab.com:57349/scecom';
const dbName = 'scecom';

(async () => {
  const client = await MongoClient.connect(url);
  const db = client.db(dbName);

  const categories = await db.collection('categories').find().toArray();

  for (let category of categories) {
    //category._id =  ObjectID();
    //console.log(category._id);
    console.log(ObjectID(category._id));
    var str=category._id;
    str=str.replace("ObjectId(","");
str=str.replace(")","");
str=str.replace(/['"]+/g, '');
console.log(str);
category._id =  str;
      await db.collection('categories').replaceOne({ _id: category._id }, category);
  }

  client.close();
})();