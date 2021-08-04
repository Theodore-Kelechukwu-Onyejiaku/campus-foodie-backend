var express = require('express');
var router = express.Router();
var paymentController = require("../controllers/paymentController")

router.post("/", paymentController.makePayment);

module.exports = router;