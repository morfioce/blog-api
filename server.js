// require core module
const assert = require('assert');

// Require 3-third party packages
const {MongoClient, ObjectID} = require('mongodb');
const express = require('express');
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');

// require my modules
const router = require('./router/index.js');
const middelware = require('./middelware/index.js');

const app = express();

// Configure the template engine
app.set('view engine', 'hbs');

// Static file router
app.use(express.static('public/'));

// Body parser middelware
app.use(body_parser.json());
// parse application/x-www-form-urlencoded
app.use(body_parser.urlencoded({ extended: false }))
app.use(cookie_parser());

// Logger middelware
app.use(middelware.logger);

app.get('/blogs', middelware.authenticate, (req, res) => {
  router.posts.find_all_posts((err, response) => {
    if (err) {
      return res.status(400).send()
    } else {
      res.render('blogs.hbs', {"posts": response});
    }
  })
})

app.get('/blog/:postId', middelware.authenticate, (req, res) => {
  router.posts.find_post_by_id(req.params.postId, {}, (err, post) => {
    if (err) {
      res.render('error.hbs', {status: 404, reason:"post id not found"});
    } else {
      res.render('blog.hbs', {"post": post});
    }
  });
});

app.get('/edit/blog/:postId', middelware.authenticate, (req, res) => {
  router.posts.find_post_by_id(req.params.postId, {}, (err, post) => {
    if (err) {
      res.render('error.hbs', {status: 404, reason:"post id not found"});
    } else {
      res.render('edit-blog.hbs', {"post": post});
    }
  });
});

app.post('/edit/blog/:postId', middelware.authenticate, (req, res) => {
  router.posts.update(req.params.postId, req.body, (err, post) => {
    if (err) {
      res.render('error.hbs', {status: 404, reason:"post id not found"});
    } else {
      res.redirect('/blogs');
    }
  });
});

app.get('/remove/blog/:postId', middelware.authenticate, (req, res) => {
  router.posts.find_post_by_id(req.params.postId, {}, (err, post) => {
    if (err) {
      res.render('error.hbs', {status: 404, reason:"post id not found"});
    } else {
      res.render('remove-blog.hbs', {"post": post});
    }
  });
});

// -------- APPLICATION API --------

// POST /users/signup
app.post('/users/signup', router.users.signup);

// POST /users/login
app.post('/users/login', router.users.login);

// GET /posts
app.get('/posts', middelware.authenticate, (req, res) => {
  router.posts.find_all_posts( (err, result) =>{
    if (err) {
      res.status(400).send();
    } else {
      res.send(result);
    }
  });
});

// GET /posts/:postId
app.get('/posts/:postId', middelware.authenticate, (req, res) => {
  router.posts.find_post_by_id(
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
app.post('/posts', middelware.authenticate, (req, res) => {
  router.posts.create(req.body, (err) => {
    if (err) {
      res.status(400).send();
    }
    res.send('post created');
  })
});

// DELETE /posts/:postId
app.delete('/posts/:postId', middelware.authenticate, (req, res) => {

  router.posts.remove(req.params.postId, (err, data) => {
    if(err) {
      res.status(400).send();
    }
    res.send({
      message:'post delted',
      data: data.value
    });
  })
})

// PUT /posts/:postId
app.put('/posts/:postId', middelware.authenticate, (req, res) => {
  router.posts.update(req.params.postId, req.body, (err, data) => {
    if(err){
      res.status(400).send();
    } else {
      res.send(data);
    }
  });
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

// GET /posts/:postId/comments/:commentId
app.get('/posts/:postId/comments/:commentId', (req, res) => {
  router.comments.get_comment_by_id(
    req.params.postId,
    req.params.commentId,
    (err, data) => {
      if (err) {
        return res.status(400).send()
      }

      res.send(data);
    }
  );
})

//POST /posts/:postsId/comments
app.post('/posts/:postId/comments', (req,res) =>{
  if(req.body.text === ""){
     return res.status(400).send()
  }
  let new_comment = req.body.text ;
   router.comments.create(
    req.params.postId,
    new_comment,
    (err, data) => {
      if(err) {
        return res.status(400).send()
      }
      res.send(data);
    })
})

// DELETE /posts/:postId/comments/:commentId
app.delete('/posts/:postId/comments/:commentId', (req, res) => {
  router.comments.remove(
    req.params.postId,
    req.params.commentId,
    (err, data) => {
      if(err) {
        return res.status(400).send()
      }
      res.send(data);
    }
  )
});

// PUT /posts/:postId/comments/:commentId
app.put('/posts/:postId/comments/:commentId', (req, res) => {
  if (!req.body.text) {
    return res.status(400).send();
  }

  router.comments.update(
    req.params.postId,
    req.params.commentId,
    req.body.text,
    (err, data) => {
      if(err) {
        return res.status(400).send()
      }
      res.send(data);
    }
  )
});

app.listen(3000, (err) => {
  assert.equal(err, null);
  console.log('Server is up and running at port 3000')
})