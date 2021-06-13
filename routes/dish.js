var express = require('express');
var router = express.Router();

const dishController = require("../controllers/dishController")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('This is the dish route');
  next();
});

router.get("/all-dishes", dishController.getDishes);

// POST 
router.post("/add-dish", dishController.addDish);

// DELETE 
router.delete("")

module.exports = router;
