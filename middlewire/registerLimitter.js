const limitter = require("express-rate-limit");
//Saving register route from BruteForce Attack.
const registerLimitter = limitter({
    windowMS: 5 * 60 * 1000,
    max: 2,
    message:null,
    standardHeaders: true,
    legacyHeaders: false,
    
  });

  const loginLimitter = limitter({
    windowMS: 5 * 60 * 1000,
    max: 2,
    onLimitReached:(req,res,options)=>{
      res.redirect("/406/error")
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  module.exports = {
    registerLimitter,
    loginLimitter
  }