var express = require('express');
var router = express.Router();
const orderController = require("../controllers/orderController");

/* GET users listing. */
router.post('/', orderController.makeOrder);
router.get("/user-orders/:userId", orderController.getUserOrders)

module.exports = router;