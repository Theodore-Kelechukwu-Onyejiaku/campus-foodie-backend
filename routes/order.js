var express = require('express');
var router = express.Router();
const orderController = require("../controllers/orderController");

/* GET users listing. */
router.post('/', orderController.makeOrder);
router.get("/user-orders/:userId", orderController.getUserOrders)
router.get("/customer-confirm/:userId", orderController.customerConfirmation);

module.exports = router;