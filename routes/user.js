const express = require('express');
const router = express.Router();
const {verifyUser} = require("../auth/jwtVerification")

/* GET users listing. */
router.get('/', verifyUser, function(req, res, next) {
  console.log(req.userId)
  res.status(200).json({message:'This is the user id:'+req.userId});
});


module.exports = router;