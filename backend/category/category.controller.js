const Category = require('./category.model');

createCategoryObj = (body) => {
    return new Category({
        name: body.name,
        description: body.description
    });
}  

module.exports = {
    getAll: (req, res) => {
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.page;
        const categoryQuery = Category.find();
        let fetchedResults;
        if (pageSize && currentPage) {
            categoryQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
        }
    
        categoryQuery.find()
            .then(result => {
                fetchedResults = result;
                return Category.countDocuments();
            })
            .then(count => {
                res.status(200).json({
                    categories: fetchedResults,
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
            const categoryQuery = Category.find({createdBy: req.params.id})
                .skip(pageSize * (currentPage - 1))
                .limit(pageSize);
  
            categoryQuery.find()
                .then(result => {
                    fetchedResults = result;
                    return Category.find({createdBy: req.params.id}).countDocuments();
                })
                .then(count => {
                    res.status(200).json({
                        categories: fetchedResults,
                        total: count
                    });
                }).catch(err => {
                    res.status(404).send(err);
                });
        } else {
            Category.findById(req.params.id)
                .then(result => {
                    if(result) {
                        res.status(200).json(result);
                    } else {
                        res.status(404).json({ message: 'Category not found!' });
                    }
                }).catch(err => {
                    res.status(400).send(err);
                })
        }
    },

    post : (req, res) => {
        const category = createCategoryObj(req.body);
        category.createdBy = req.tokenData.userId;
        category.dateCreated = new Date();
        category.save()
            .then(result => {
                res.status(201).json({
                    message: 'Category is saved!',
                    category: result
                });
            }).catch(err => {
                res.status(400).send(err);
            });
    },

    put : (req, res) => {      
        const category = new Category({
            _id: req.body.id,
            name: req.body.name,
            description: req.body.description, 
            createdBy: req.tokenData.userId,
            dateUpdated: new Date()
        });
        console.log(category)
        Category.updateOne({ _id: req.params.id, createdBy: req.tokenData.userId }, category)
            .then(() => {
                res.status(200).json({ message: 'Category is updated' });
            }).catch(err => {
                res.status(404).send(err);
            });
    },

    delete : (req, res) => {
        Category.deleteOne({ _id: req.params.id, createdBy: req.tokenData.userId })
            .then(result => {
                if(result.n > 0) {
                    res.status(200).json({message: 'Category deleted'});
                } else {
                    res.status(401).json({ message: 'Unauthorized' });
                }
            }).catch(err => {
                res.status(404).send(err);
            });
    },
}