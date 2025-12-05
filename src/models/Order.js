const mongoose = require("mongoose");

// Single Item inside the Order
const orderItemSchema = new mongoose.Schema({
  itemName: { type: String },
  qty: { type: Number, min: 1 },
  price: { type: Number, min: 0 }
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      trim: true
    },

    customerName: {
      type: String,
      trim: true
    },

    customerMobile: {
      type: String
    },

    items: {
      type: [orderItemSchema]
    },

    orderDateTime: {
      type: Date,
      default: Date.now
    },

    totalPrice: {
      type: Number,
      min: 0
    },

    status: {
      type: String,
      enum: ["Completed", "Cancelled"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

// Clear old model (for hot reload)
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

module.exports = mongoose.model("Order", orderSchema);