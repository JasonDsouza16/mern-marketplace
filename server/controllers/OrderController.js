const Order = require("../models/Order");
const User = require("../models/User");
const OrderItem = require("../models/orderItem");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createOrUpdateOrder = async (req, res) => {
  try {
    // Extract product ID and user email from request body
    const { productId, userEmail, quantity } = req.body;

    // Find the user by email
    let user = await User.findOne({ email: userEmail });

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's cart order with status "in cart"
    let cartOrder = await Order.findOne({
      user: user._id,
      status: "in cart",
    }).populate("items.item");

    // If no cart order exists, create a new one
    if (!cartOrder) {
      cartOrder = new Order({
        user: user._id,
        status: "in cart",
        items: [], // Initialize empty items array
      });
    }

    // Find if the item already exists in the cart order's items
    const existingOrderItemIndex = cartOrder.items.findIndex(
      (orderItem) => orderItem.item._id.toString() === productId
    );

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
    await cartOrder.populate("items.item"); // Ensure items are populated with their details
    cartOrder.orderGrandTotal = calculateOrderGrandTotal(cartOrder.items);

    // Save the cart order to the database
    await cartOrder.save();

    // Return success response
    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error creating or updating order:", error);
    res.status(500).json({ message: "Internal server error" });
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
  return total;
};

exports.createPaymentIntent = async (req, res) => {
  const { userEmail } = req.body;
  console.log("email ", userEmail);
  try {
    const user = await User.findOne({ email: userEmail });
    const userOrder = await Order.findOne({
      user: user._id,
      status: "in cart",
    }).populate("items.item");

    if (!userOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const lineItems = userOrder.items.map((orderItem) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: orderItem.item.name,
        },
        unit_amount: orderItem.item.price * 100,
      },
      quantity: orderItem.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/transaction-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/transaction-fail`,
      metadata: {
        orderId: userOrder._id.toString(),
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOrdersByUserEmail = async (req, res) => {
  try {
    const userEmail = req.params.userEmail;

    // Find the user by email
    const user = await User.findOne({ email: userEmail });

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find all orders for the user
    const orders = await Order.find({ user: user._id }).populate("items.item");

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateSuccessOrderStatus = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const orderId = session.metadata.orderId;

    // Update the order date and status to "ordered"
    await Order.findByIdAndUpdate(orderId, {
      status: "ordered",
      date: Date.now,
    });

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
