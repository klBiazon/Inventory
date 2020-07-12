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
        return Product.countDocuments();
      })
      .then(count => {
        res.status(200).json({
          products: fetchedResults,
          total: count
        });
      }).catch(err => {
        res.status(404).send(err);
      });
  },

  get : (req, res) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;

    if (pageSize && currentPage) {
      const productQuery = Product.find({createdBy: req.params.id})
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);

      productQuery.find()
        .then(result => {
          fetchedResults = result;
          return Product.find({createdBy: req.params.id}).countDocuments();
        })
        .then(count => {
          res.status(200).json({
            products: fetchedResults,
            total: count
          });
        }).catch(err => {
          res.status(404).send(err);
        });
    } else {
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
    }
  },

  post : (req, res) => {
    const url = req.protocol + "://" + req.get("host");
    req.body.imgUrl = url + "/images/" + req.file.filename;
    const product = createProductObj(req.body);
    product.createdBy = req.tokenData.userId;
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
      imgUrl: req.body.imgUrl,
      createdBy: req.tokenData.userId
    });
    console.log(product);
    Product.updateOne({ _id: req.params.id, createdBy: req.tokenData.userId }, product)
      .then(result => {
        res.status(200).json({ message: 'Product is updated', imgUrl: product.imgUrl });
      }).catch(err => {
        res.status(404).send(err);
      });
  },

  delete : (req, res) => {
    Product.deleteOne({ _id: req.params.id, createdBy: req.tokenData.userId })
      .then(result => {
        if(result.n > 0) {
          res.status(200).json({message: 'Product deleted'});
        } else {
          res.status(401).json({ message: 'Unauthorized' });
        }
      }).catch(err => {
        res.status(404).send(err);
      });
  }
}