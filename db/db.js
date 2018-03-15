const {MongoClient} = require('mongodb');

const mongodb_url = 'mongodb://localhost:27017';
const database = 'blog-app';

let db = null;

let getDB = (callback) => {
  if (db) {
    callback(null, db);
  } else {
    MongoClient.connect(mongodb_url, (err, client) => {
      if (err) {
        return callback(err, null);
      } else {
        db = client.db(database)
        callback(null, db);
      }
  });
  }
}

// module.exports = {"getDB":getDB};
module.exports = {getDB};
