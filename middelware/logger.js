const fs = require('fs');

let logger = (req, res, next) => {
  let time = (new Date()).toString();
  let method = req.method;
  let url = req.url;
  fs.appendFileSync('./logs/server.log', `${method} ${url} at ${time}\n`);
  // res.send('you can not go anywhere :D')
  next();
}

module.exports = {logger};