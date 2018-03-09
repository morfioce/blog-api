// require core module
const assert = require('assert');

// Require 3-third party packages
const {MongoClient, ObjectID} = require('mongodb');
const express = require('express');
const body_parser = require('body-parser');

// require my modules
const router = require('./router/index.js');

const mongodb_url = 'mongodb://localhost:27017';
const database = 'blog-app';

const app = express();
app.use(body_parser.json());

MongoClient.connect(mongodb_url, (err, client) => {
  assert.equal(err, null, 'Can not connect to MongoDB');

  const db = client.db(database);

  // GET /posts
  app.get('/posts', (req, res) => {
    router.posts.find_all_posts(db, (err, result) =>{
      if (err) {
        res.status(400).send();
      } else {
        res.send(result);
      }
    });
  });

  // GET /posts/:postId
  app.get('/posts/:postId', (req, res) => {
    router.posts.find_post_by_id(
      db,
      req.params.postId,
      {},
      (err, data) => {
        console.log(data)
        if (err) {
          return res.status(400).send();
        }
        // console.log(data)
        res.send(data);
      });
  });

  // POST /posts
  app.post('/posts', (req, res) => {
    router.posts.create(req.body, (err) => {
      if (err) {
        res.status(400).send();
      }
      res.send('post created');
    })
  });

  // DELETE /posts/:postId
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

    router.posts.find_post_by_id(
      db,
      postId,
      {comments: 1},
      (err, result) =>{
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