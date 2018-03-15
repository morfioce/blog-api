const assert = require('assert');
const jwt = require('jsonwebtoken');
const {ObjectID} = require('mongodb');
const database = require('../db/db.js');
const secret = 'secret';

let db;
database.getDB((err, dbConnection) => {
  assert.equal(null, err);
  db = dbConnection;
});

let getUserByToken = (token, callback) => {
  // if there is a user with _id then callback(null, user)
  // else callback('error', null)
  let data;
  try {
    data = jwt.verify(token, secret);
  } catch (err) {
    return callback(err, null);
  }

  db.collection('Users').findOne({
    _id: new ObjectID(data._id),
    token: token
  }, (err, user) => {
    if (err || !user) return callback(err, null);
    callback(null, user);
  })
}

// Define authentication middelware
let authenticate = (req, res, next) => {
  getUserByToken(req.cookies.token || req.header('x-auth'), (err, user) => {
    if (err) {
      return res.status(401).send()
    }

    req.user = user;
    req.token = user.token;
    next();
  })
}

module.exports = {authenticate};