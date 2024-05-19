const User = require('../models/User');
const Order = require('../models/Order');

exports.createOrUpdateUser = async (req, res) => {
  const { name, email, role } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user
      user.name = name;
    } else {
      // Create new user
      user = new User({ name, email, role });
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const { userEmail } = req.params;

    let user = await User.findOne({ email: userEmail });

    if (user) {
      // Update existing user
      userId = user._id;
    } else {
      // Create new user
      return res.status(404).json({ message: 'No user found' });
    }

    // Find the user's cart order with status "in cart"
    const cartOrder = await Order.findOne({ user: userId, status: 'in cart' }).populate('items.item', 'name price');
    if (!cartOrder) {
      return res.status(404).json({ message: 'Cart is empty' });
    }

    res.status(200).json(cartOrder);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserRoleByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.userEmail });
    if (user) {
      res.json({ role: user.role });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
