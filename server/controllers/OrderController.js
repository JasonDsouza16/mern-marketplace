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
    // Extract product ID and user email from request body
    const { productId, userEmail, quantity } = req.body;

    // Find the user by email
    let user = await User.findOne({ email: userEmail });

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the user's cart order with status "in cart"
    let cartOrder = await Order.findOne({ user: user._id, status: 'in cart' }).populate('items.item');

    // If no cart order exists, create a new one
    if (!cartOrder) {
      cartOrder = new Order({
        user: user._id,
        status: 'in cart',
        items: [], // Initialize empty items array
      });
    }

    // Find if the item already exists in the cart order's items
    const existingOrderItemIndex = cartOrder.items.findIndex(orderItem => orderItem.item._id.toString() === productId);

    // If the item already exists, increment its quantity by 1
    if (existingOrderItemIndex !== -1) {
      cartOrder.items[existingOrderItemIndex].quantity += quantity;
      if (cartOrder.items[existingOrderItemIndex].quantity <= 0) {
        cartOrder.items.splice(existingOrderItemIndex, 1);
      }
    } else {
      // If the item doesn't exist, create a new order item with quantity 1
      const orderItem = {
        item: productId,
        quantity: 1,
      };

      // Push the order item to the cart order's items array
      cartOrder.items.push(orderItem);
    }

    // Calculate the grand total for the order
    await cartOrder.populate('items.item'); // Ensure items are populated with their details
    cartOrder.orderGrandTotal = calculateOrderGrandTotal(cartOrder.items);

    // Save the cart order to the database
    await cartOrder.save();

    // Return success response
    res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error creating or updating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Function to calculate the grand total for the order
const calculateOrderGrandTotal = (items) => {
  let total = 0;
  for (const item of items) {
    // Check if the item and its price are defined
    if (item.item && item.item.price) {
      console.log(item.quantity , item.item.price)
      total += item.quantity * item.item.price;
    }
  }
  console.log(total)
  return total;
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
