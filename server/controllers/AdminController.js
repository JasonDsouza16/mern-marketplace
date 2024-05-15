const Item = require('../models/Item');
const User = require('../models/User');

exports.approveItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.disapproveItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { status: 'disapproved' }, { new: true });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
