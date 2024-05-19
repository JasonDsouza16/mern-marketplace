const mongoose = require('mongoose');
const orderItemSchema = require('./OrderItem');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema], 
  status: { type: String, enum: ['in cart', 'ordered', 'cancelled'], default: 'in cart' },
  orderDate: { type: Date, default: Date.now },
  orderGrandTotal: { type: Number, default: 0 },
});

module.exports = mongoose.model('Order', orderSchema);
