var express = require('express');
var router = express.Router();
const jwtVerification = require("../auth/jwtVerification");
const adminController = require("../controllers/adminController")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('This is the admin route');
});

router.get("/dashboard",jwtVerification.verifyUser, jwtVerification.verifyAdmin, adminController.getDashboard);
router.get("/users", jwtVerification.verifyUser, jwtVerification.verifyAdmin, adminController.getAllUsers);

module.exports = router;