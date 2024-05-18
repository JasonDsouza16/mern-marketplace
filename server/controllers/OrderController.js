const Order = require('../models/Order');
const User = require('../models/User');
const OrderItem = require('../models/orderItem');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
      total += item.quantity * item.item.price;
    }
  }
  console.log(total)
  return total;
};


exports.createPaymentIntent = async (req, res) => {
  const { userEmail } = req.body;
  console.log("email ",userEmail)
  try {
    const user = await User.findOne({email: userEmail}) 
    const userOrder = await Order.findOne({ user: user._id, status: 'in cart' }).populate('items.item');

    if (!userOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const lineItems = userOrder.items.map(orderItem => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: orderItem.item.name,
        },
        unit_amount: orderItem.item.price * 100, 
      },
      quantity: orderItem.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
 payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        orderId: userOrder._id.toString(),
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.handleWebhook = (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    // Handle successful payment here (update order status, etc.)
    console.log('PaymentIntent was successful!');
  }

  res.json({ received: true });
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
