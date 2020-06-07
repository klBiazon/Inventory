const Product = require('./products.model');

createProductObj = (body) => {
  return new Product({
    name: body.name,
    imgUrl: body.imgUrl
  });
}

module.exports = {
  getAll : (req, res) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const productQuery = Product.find();
    let fetchedResults;

    if (pageSize && currentPage) {
      productQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }

    productQuery.find()
      .then(result => {
        fetchedResults = result;
        return Product.count();
      })
      .then(count => {
        res.status(200).json({
          products: fetchedResults,
          total: count
        });
      })
      .catch(err => {
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
    const url = req.protocol + "://" + req.get("host");
    req.body.imgUrl = url + "/images/" + req.file.filename;
    const product = createProductObj(req.body);
    
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
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      req.body.imgUrl = url + "/images/" + req.file.filename;
    }
    
    product = new Product({
      _id: req.body.id,
      name: req.body.name,
      imgUrl: req.body.imgUrl
    });
    
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