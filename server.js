const assert = require('assert');

const {MongoClient, ObjectID} = require('mongodb');
const express = require('express');
const body_parser = require('body-parser');

const mongodb_url = 'mongodb://localhost:27017';
const database = 'blog-app';

const app = express();
app.use(body_parser.json());

MongoClient.connect(mongodb_url, (err, client) => {
  assert.equal(err, null, 'Can not connect to MongoDB');

  const db = client.db(database);

  let find_all_posts = (db, callback) => {
    db.collection('posts').find().toArray((err, data) => {
        if (err) {
          return callback(err)
        }
        callback(null, data);
      });
  }

  let find_post_by_id = (db, id, callback) => {
    db.collection('posts').findOne({_id: id}, {projection: {comments: 1}}, (err, data) => {
      if (err) {
        return callback(err)
      }
      console.log(data.comments)
      callback(null, data);
    });
  }
  // GET /posts
  app.get('/posts', (req, res) => {
    find_all_posts(db, (err, result) =>{
      if (err) {
        res.status(400).send();
      } else {
        res.send(result);
      }
    });
  });

  // GET /posts/:postId
  app.get('/posts/:postId', (req, res) => {
    let post_id = new ObjectID(req.params.postId);
    // res.send('route is working');
    db.collection('posts').findOne({"_id": post_id}, (err, data) => {
      if (err) {
        return res.status(500).send();
      }
      // console.log(data)
      res.send(data);
    });
  });

  // POST /posts
  app.post('/posts', (req, res) => {
    let post = req.body;
    if (!post.name || !post.text) {
      return res.status(400).send()
    }

    db.collection('posts').insertOne({
      name: post.name,
      text: post.text,
      url : null,
      comments: []
    }, (err) => {
      assert.equal(null, err);
      res.send('post added');
    })
  });

  app.delete('/posts/:postId', (req, res) => {
    let postId;
    try {
          postId = new ObjectID(req.params.postId);
    } catch (e ) {
          return res.status(400).send('bad request 400');
    }
    db.collection('posts').findOneAndDelete({"_id": postId}, (err, data) =>{
      if(err){
        res.send("error finding data");
      } else {
        res.send(data.value);
      }
    })
  })
  app.put('/posts/:postId', (req, res) => {
    let updatedPost = {}
    if(req.body.name) {
      updatedPost.name = req.body.name;
    }

    if(req.body.text) {
      updatedPost.text = req.body.text;
    }

    let postId;
    try {
      postId = new ObjectID(req.params.postId);
    } catch (e ) {
      return res.status(400).send('bad request 400');
    }
    // db.collection('posts').findOneAndUpdate({"_id": postId},{...updatedPost},(err, data) =>{
    db.collection('posts').findOneAndUpdate({"_id": postId},
      {$set: {...updatedPost}}, (err, data) =>{
      if(err){
        res.send("error finding data");
      } else {
        res.send(data.value);
      }
    })
  })

  // GET /posts/:postId/comments
  app.get('/posts/:postId/comments', (req, res) => {
    let postId;
    try {
          postId = new ObjectID(req.params.postId);
    } catch (e ) {
          return res.status(400).send('bad request 400');
    }

    find_post_by_id(db, postId,(err, result) =>{
      if (err) {
        res.status(400).send();
      } else {
        res.send(result);
      }
    });
  });
})

app.listen(3000, (err) => {
  assert.equal(err, null);
  console.log('Server is up and running at port 3000')
})