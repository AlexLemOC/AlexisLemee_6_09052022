const rateLimit = require("express-rate-limit");


const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3,
});


module.exports = {limiter}