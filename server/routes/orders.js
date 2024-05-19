const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

// Routes for Order
router.post('/', OrderController.createOrUpdateOrder);
router.post('/create-payment-intent', OrderController.createPaymentIntent);
router.post('/update-success-order-status', OrderController.updateSuccessOrderStatus);
router.get('/my-orders/:userEmail', OrderController.getOrdersByUserEmail);

module.exports = router;
