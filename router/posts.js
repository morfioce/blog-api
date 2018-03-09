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

let remove = (db, id, callback) => {
  let post_id;
  try {
    post_id = new ObjectID(id);
  } catch(e) {
    return callback(e);
  }
  db.collection('posts').findOneAndDelete({"_id": post_id}, (err, data) =>{
    if(err) {
      return callback(err);
    } else {
      callback(null, data);
    }
  });
}

let update = (db, id, update, callback) => {
  let updatedPost = {}
  if(update.name) {
    updatedPost.name = update.name;
  }

  if(update.text) {
    updatedPost.text = update.text;
  }

  let postId;
  try {
    postId = new ObjectID(id);
  } catch (e ) {
    return callback('error');
  }
  // db.collection('posts').findOneAndUpdate({"_id": postId},{...updatedPost},(err, data) =>{
  db.collection('posts').findOneAndUpdate({"_id": postId},
    {$set: {...updatedPost}}, (err, data) =>{
    if(err){
      callback('error');
    } else {
      callback(null, data.value);
    }
  })
}

module.exports = {
  find_all_posts ,
  find_post_by_id ,
  remove,
  update
}