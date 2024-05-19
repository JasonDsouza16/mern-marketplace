const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  ownedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Array of order references
  role: { type: String, enum: ['user', 'admin']},
});

module.exports = mongoose.model('User', userSchema);
