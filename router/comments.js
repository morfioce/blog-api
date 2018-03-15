const assert = require('assert');
const {ObjectID} = require('mongodb');
const posts = require('./posts.js');

const database = require('../db/db.js')

let db;
database.getDB((err, dbConnection) => {
  assert.equal(null, err);
  db = dbConnection;
});

let get_comment_by_id = (post_id, comment_id, callback) => {
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
// findOneAndUpdate({}, {$push})
// https://docs.mongodb.com/manual/reference/operator/update/push/#append-a-value-to-an-array
let create = (postId, comment , callback) =>{
  let post_id;
  let comment_id;
  try {
    post_id = new ObjectID(postId);
    comment_id = new ObjectID()
  } catch (e) {
    callback('error');
  }


  db.collection('posts').findOneAndUpdate(
     {_id : new ObjectID(postId)},
     {$push :{comments : {_id: comment_id, text: comment} }},
     callback
  )
}


// PUT /posts/:postId/comments/:commentId
// findOneAndUpdate({}, {$?})
// https://docs.mongodb.com/manual/reference/operator/update/positional/#update-documents-in-an-array
let update = (postId, commentId, commentText, callback) =>{
  let post_id;
  let comment_id;
  try {
    post_id = new ObjectID(postId);
    comment_id = new ObjectID(commentId)
  } catch (e) {
    callback('error');
  }


  db.collection('posts').findOneAndUpdate(
    {_id : post_id, "comments._id": comment_id},
    {$set :{"comments.$.text" : commentText}},
    callback
  )
}

// DELETE /posts/:postId/comments/:commentId
// findOneAndUpdate({}, {$pull})
// https://docs.mongodb.com/manual/reference/operator/update/pull/#remove-items-from-an-array-of-documents
let remove = (postId, commentId , callback) =>{
  let post_id;
  let comment_id;
  try {
    post_id = new ObjectID(postId);
    comment_id = new ObjectID(commentId)
  } catch (e) {
    callback('error');
  }


  db.collection('posts').findOneAndUpdate(
    {_id : post_id},
    {$pull :{comments : {_id: comment_id} }},
    callback
  )
}

module.exports = {
  get_comment_by_id,
  create,
  update,
  remove
}