const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

// Routes for Order
//router.post('/', OrderController.createOrder);
router.post('/', OrderController.createOrUpdateOrder);
router.get('/', OrderController.getAllOrders);
router.get('/:id', OrderController.getOrderById);
router.put('/:id', OrderController.updateOrder);
router.delete('/:id', OrderController.deleteOrder);

module.exports = router;
