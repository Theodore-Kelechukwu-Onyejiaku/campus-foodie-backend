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
router.get("/users/:id", jwtVerification.verifyUser, jwtVerification.verifyAdmin, adminController.getSingleUser);
router.get("/products", jwtVerification.verifyUser, jwtVerification.verifyAdmin, adminController.getAllProducts);
router.get("/products/:id", jwtVerification.verifyUser, jwtVerification.verifyAdmin, adminController.getSingleProduct);

router.put("/products/:id", jwtVerification.verifyUser, jwtVerification.verifyAdmin, adminController.updateSingleProduct)

router.delete("/products/:id", jwtVerification.verifyUser, jwtVerification.verifyAdmin, adminController.deleteSingleProduct)

module.exports = router;