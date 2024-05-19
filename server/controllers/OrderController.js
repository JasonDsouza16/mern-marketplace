const Order = require("../models/Order");
const User = require("../models/User");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createOrUpdateOrder = async (req, res) => {
  try {
    const { productId, userEmail, quantity } = req.body;

    let user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let cartOrder = await Order.findOne({
      user: user._id,
      status: "in cart",
    }).populate("items.item");

    if (!cartOrder) {
      cartOrder = new Order({
        user: user._id,
        status: "in cart",
        items: [],
      });
    }

    const existingOrderItemIndex = cartOrder.items.findIndex(
      (orderItem) => orderItem.item._id.toString() === productId
    );

    if (existingOrderItemIndex !== -1) {
      cartOrder.items[existingOrderItemIndex].quantity += quantity;
      if (cartOrder.items[existingOrderItemIndex].quantity <= 0) {
        cartOrder.items.splice(existingOrderItemIndex, 1);
      }
    } else {
      const orderItem = {
        item: productId,
        quantity: 1,
      };

      cartOrder.items.push(orderItem);
    }

    await cartOrder.populate("items.item");
    cartOrder.orderGrandTotal = calculateOrderGrandTotal(cartOrder.items);

    await cartOrder.save();

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error creating or updating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const calculateOrderGrandTotal = (items) => {
  let total = 0;
  for (const item of items) {
    if (item.item && item.item.price) {
      total += item.quantity * item.item.price;
    }
  }
  return total;
};

exports.createPaymentIntent = async (req, res) => {
  const { userEmail } = req.body;

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
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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
