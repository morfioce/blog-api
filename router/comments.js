const {ObjectID} = require('mongodb');
const posts = require('./posts.js');

let get_comment_by_id = (db, post_id, comment_id, callback) => {
  let commentId = new ObjectID(comment_id);
  // let postId = new ObjectID(post_id);

  posts.find_post_by_id(
    db,
    post_id,
    {"comments": {$elemMatch:{_id: commentId}}},
    (err, data) => {
      if (err) {
        return callback('error');
      }

      callback(null, data);
    }
  );
}

// POST /posts/:postId/comments
// --> findOneAndUpdate({}, {$push})
// https://docs.mongodb.com/manual/reference/operator/update/push/#append-a-value-to-an-array
let create = (db, post_id, comment, callback) => {
  let postId;

  try {
    postId = new ObjectID(post_id);
  } catch(e) {
    return res.status(400).send();
  }

  db.collection('posts').findOneAndUpdate(
    {_id: postId},
    {$push:{comments: comment}},
    (err, data) => {
      if (err) {
        return callback('error');
      }

      callback(null, data);
    }
  );
}

// PUT /posts/:postId/comments/:commentId
// --> findOneAndUpdate({_id: post_id, "comments._id": comment_id}, {$set})
// https://docs.mongodb.com/manual/reference/operator/update/positional/#update-documents-in-an-array
let update = (db, post_id, comment_id, comment_text, callback) => {
  let postId;
  let commentId;
  try {
    postId = new ObjectID(post_id);
    commentId = new ObjectID(comment_id);
  } catch(e) {
    return callback('error');
  }

  db.collection('posts').findOneAndUpdate(
    {_id: new ObjectID(post_id), "comments._id": commentId},
    {$set:{"comments.$.text": comment_text}},
    (err, data) => {
      if (err) {
        return callback('error');
      }

      callback(null, data);
    }
  );
}

// DELETE /posts/:postId/comments/:commentId
// --> findOneAndUpdate({}, {$pull})
// https://docs.mongodb.com/manual/reference/operator/update/pull/#remove-items-from-an-array-of-documents
let remove = (db, post_id, comment_id, callback) => {
  let postId;
  let commentId;
  try {
    postId = new ObjectID(post_id);
    commentId = new ObjectID(comment_id);
  } catch(e) {
    return callback('error');
  }

  db.collection('posts').findOneAndUpdate(
    {_id: new ObjectID(post_id)},
    {$pull:{ comments: {_id: commentId}}},
    (err, data) => {
      if (err) {
        return callback('error');
      }

      callback(null, data);
    }
  );
}

module.exports = {
  get_comment_by_id,
  create,
  update,
  remove
}