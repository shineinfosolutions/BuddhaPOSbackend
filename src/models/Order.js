const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String },
  mobileNumber: { type: String },
  items: [{
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    name: { type: String },
    quantity: { type: Number },
    price: { type: Number }
  }],
  totalAmount: { type: Number },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cash', 'card', 'upi'], default: 'cash' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);