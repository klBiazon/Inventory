const Product = require('./products.model');

createProductObj = (body) => {
  return new Product({
    _id: body.id,
    name: body.name,
    imgUrl: body.imgUrl
  });
}

module.exports = {
  getAll : (req, res) => {
    Product.find()
      .then(result => {
        res.status(200).json({
          products: result
        });
      }).catch(err => {
        res.status(404).send(err);
      });
  },

  get : (req, res) => {
    Product.findById(req.params.id)
      .then(result => {
        if(result) {
          res.status(200).json(result);
        } else {
          res.status(404).json({ message: 'Product not found!' });
        }
      }).catch(err => {
        res.status(400).send(err);
      })
  },

  post : (req, res) => {
    const product = createProductObj(req.body);
    delete product._id;
    product.save()
      .then(result => {
        res.status(201).json({
          message: 'Product is saved!',
          product: result
        });
      }).catch(err => {
        res.status(400).send(err);
      });
  },

  put : (req, res) => {
    const product = createProductObj(req.body);
    
    Product.updateOne({ _id: req.params.id }, product)
      .then(result => {
        res.status(201).json({
          message: 'Product is updated'
        });
      }).catch(err => {
        res.status(404).send(err);
      });
  },

  delete : (req, res) => {
    Product.deleteOne({ _id: req.params.id })
      .then(result => {
        res.status(200).json({message: 'Product deleted'});
      }).catch(err => {
        res.status(404).send(err);
      });
  }
}