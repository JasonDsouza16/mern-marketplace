const Order = require('../models/Order');
const User = require('../models/User');
const OrderItem = require('../models/orderItem');


exports.createOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//required
exports.createOrUpdateOrder = async (req, res) => {
  try {
    // Extract product ID, user email, and quantity from request body
    const { productId, userEmail, quantity } = req.body;

    // Ensure quantity is a positive integer
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    // Find the user by email
    let user = await User.findOne({ email: userEmail });

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the user's cart order with status "in cart"
    let cartOrder = await Order.findOne({ user: user._id, status: 'in cart' });

    // If no cart order exists, create a new one
    if (!cartOrder) {
      cartOrder = new Order({
        user: user._id,
        status: 'in cart',
      });
      await cartOrder.save();
    }

    // Find if the item already exists in the user's orders
    const existingOrderItem = cartOrder.items.find(orderItem => orderItem.item.toString() === productId);

    // If the item already exists, update its quantity
    if (existingOrderItem) {
      existingOrderItem.quantity += quantity;
      await cartOrder.save();
    } else {
      // If the item doesn't exist, create a new order item
      const orderItem = {
        item: productId,
        quantity: quantity,
      };

      // Save the order item to the database
      cartOrder.items.push(orderItem);
      await cartOrder.save();
    }

    // Return success response
    res.status(200).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user items.item');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user items.item');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
