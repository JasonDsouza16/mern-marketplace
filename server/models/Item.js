const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ["Electronics", "Books", "Clothing", "Home", "Sports"],
    required: true,
  },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  image: { type: String },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "disapproved", "suspended"],
    default: "pending",
  },
});

module.exports = mongoose.model("Item", itemSchema);
