const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

// Routes for Order
//router.post('/', OrderController.createOrder);
router.post('/', OrderController.createOrUpdateOrder);
router.post('/create-payment-intent', OrderController.createPaymentIntent);
// router.post('/webhook', express.raw({ type: 'application/json' }), OrderController.handleWebhook);
router.get('/', OrderController.getAllOrders);
router.get('/:id', OrderController.getOrderById);
router.put('/:id', OrderController.updateOrder);
router.delete('/:id', OrderController.deleteOrder);
router.post('/update-success-order-status', OrderController.updateSuccessOrderStatus);
router.get('my-orders/:userEmail', OrderController.getOrdersByUserEmail);

module.exports = router;
