const {ObjectID} = require('mongodb');

let create = (post, callback) => {
  if (!post.name || !post.text) {
    return callback('error');
  }

  db.collection('posts').insertOne({
    name: post.name,
    text: post.text,
    url : null,
    comments: []
  }, (err) => {
    if (err) {
      return callback('error');
    }

    callback(null)
  });
}

let find_all_posts = (db, callback) => {
  db.collection('posts').find().toArray((err, data) => {
      if (err) {
        return callback(err)
      }
      callback(null, data);
    });
}

let find_post_by_id = (db, id, proj, callback) => {
  let post_id;
  try {
    post_id = new ObjectID(id);
  } catch(e) {
    return callback(e);
  }
  db.collection('posts').findOne({_id: post_id}, {projection: proj}, (err, data) => {
    if (err) {
      return callback(err)
    }
    callback(null, data);
  });
}

module.exports = {
  find_all_posts,
  find_post_by_id
}