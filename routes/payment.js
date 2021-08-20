var express = require('express');
var router = express.Router();
var paymentController = require("../controllers/paymentController")

router.post("/", paymentController.makePayment);
router.get("/:userId", paymentController.getPayments)


module.exports = router;