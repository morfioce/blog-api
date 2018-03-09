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
  });
}

module.exports = {
  get_comment_by_id
}