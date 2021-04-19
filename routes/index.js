var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({message: "Welcome to campus foodie"});
});

router.get("/hello", function(req, res, next){
  res.end("hello")
})

module.exports = router;