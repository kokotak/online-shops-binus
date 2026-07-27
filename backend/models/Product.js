const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: false,
    default: ''
  }
}, {
  timestamps: true // Otomatis menambahkan createdAt dan updatedAt
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
