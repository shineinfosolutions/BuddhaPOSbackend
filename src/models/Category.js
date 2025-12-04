const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      trim: true
    },
    itemName: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      min: 0
    },
    qty: {
      type: Number,
      default: 1,
      min: 1
    },
    imageUrl: {
      type: String,
      default: null
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Clear any cached model
if (mongoose.models.Category) {
  delete mongoose.models.Category;
}

module.exports = mongoose.model("Category", categorySchema);