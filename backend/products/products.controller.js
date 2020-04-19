const Product = require('./products.model');

module.exports = {
  getAll : (req, res, next) => {
    Product.find()
      .then(product => {
        res.status(200).json({
          products: product
        });
      }).catch(err => {
        res.status(404).send(err);
      });
  },

  post : (req, res, next) => {
    const product = new Product({
      name: req.body.name,
      imgUrl: req.body.imgUrl
    });
  
    product.save()
      .then(result => {
        res.status(201).json({
          message: 'Product is saved!'
        });
      }).catch(err => {
        res.status(400).send(err);
      });
  },

  delete: (req, res, next) => {
    Product.deleteOne({ _id: req.params.id })
      .then(result => {
        res.status(200).json({message: 'Product deleted'});
      }).catch(err => {
        res.status(404).send(err);
      });
  }
}