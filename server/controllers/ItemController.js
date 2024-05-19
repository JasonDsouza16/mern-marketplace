const Item = require('../models/Item');
const User = require('../models/User');

//required
exports.createItem = async (req, res) => {
  const { name, description, category, price, image, sellerEmail } = req.body;
  try {
    const user = await User.findOne({ email: sellerEmail });
    if (!user) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    const newItem = new Item({
      name,
      description,
      category,
      price,
      image,
      seller: user._id,
      status: 'pending'
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding new item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//required. populate necessary?
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApprovedItems = async (req, res) => {
  try {
    const items = await Item.find({status: "approved"})
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//required
exports.suspendItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByIdAndUpdate(id, { status: 'suspended' }, { new: true });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error('Error suspending item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//required
exports.getAllItemsByUserEmail = async (req, res) => {
  try {
    const email = req.params.userEmail;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const items = await Item.find({ seller: user._id });
    res.status(200).json(items);
  } catch (err) {
    console.log(error)
    res.status(500).json({ message: err.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('seller');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//required
exports.updateItem = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.status = status;
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
