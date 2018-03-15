const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const database = require('../db/db.js')

let db;
database.getDB((err, dbConnection) => {
  assert.equal(null, err);
  db = dbConnection;
});


let salt = bcrypt.genSaltSync(10);
let hashPassword = (password, callback) => {
  bcrypt.hash(password, salt, function(err, hash) {
    callback(null, hash);
  });
}

let signup = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send(); // Bad Request
  }

  let user;
  let id = new ObjectID();
  let token = jwt.sign({_id: id}, secret);
  hashPassword(req.body.password, (err, passwordHash) => {
    user = {
      _id: id,
      email:req.body.email,
      password: passwordHash,
      token: token
    }
    db.collection('Users').insertOne(user, (err, result) => {
      if (err) return res.status(400).send();
      res
        .header('x-auth', token)
        .send({
          id: id,
          email:req.body.email
        });
    })
  });
}

module.exports = {signup};