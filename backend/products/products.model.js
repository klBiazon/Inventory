const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true } ,
  imgUrl: { type: String }
});

module.exports = mongoose.model('Product', productSchema);