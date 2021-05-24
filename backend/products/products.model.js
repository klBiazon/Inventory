const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  categories: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Category', require: true }
  ],
  price: { type: String, require: true },
  description: { type: String },
  imgUrl: { type: String },
  dateCreated: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true }
});

module.exports = mongoose.model('Product', productSchema);