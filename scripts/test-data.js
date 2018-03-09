
const assert = require('assert');
const {MongoClient, ObjectID} = require('mongodb');

const mongodb_url = 'mongodb://localhost:27017';
const database = 'blog-app';

const data = [
  {name: "reading", text:"reading many books", url: null, comments: [
    { _id: new ObjectID(),
      text: "not good for your health"
    },
    { _id: new ObjectID(),
      text: "Eat but with care"
    }
  ]},
  {name: "writing", text:"writing many books", url: null, comments: [
    { _id: new ObjectID(),
      text: "good for you"
    },
    { _id: new ObjectID(),
      text: "How you do it?"
    }
  ]},
  {name: "eating", text:"eating many books", url: null, comments: []},
  {name: "sleeping", text:"sleeping many books", url: null, comments: []},
  {name: "walking", text:"walking many books", url: null, comments: []},
  {name: "sharing", text:"sharing many books", url: null, comments: []},
  {name: "buying", text:"buying many books", url: null, comments: []}
];

MongoClient.connect(mongodb_url, (err, client) => {
  assert.equal(null, err);

  const db = client.db(database);
  db.collection('posts')
    .remove((err) => {
      assert.equal(null, err);
      db.collection('posts').insertMany(data, (err, result) => {
        assert.equal(null, err);
        console.log(result);
        client.close();
      })
    })
})