// loggingMiddleware.js
const Log = require('../model/LogModelSchema');

function loggingMiddleware(req, res, next) {
  console.log("req",req?.user)
  const log = new Log({
    method: req.method,
    url: req.originalUrl,
  });

  const originalSend = res.send;
  res.send = function (body) {
  
    log.status = res.statusCode;
    log.responseBody = req?.user;
    log.save().catch(err => console.error('Error saving log:', err));
    originalSend.call(this, body);
  };

  next();
}

module.exports = loggingMiddleware;
