const seeder = require('mongoose-seed');
// const ProductModel = require('./backend/products/products.model');
// const Product = require('./seed-data');
const SEED = require('./seed-data');
const connectionURL = 'mongodb://localhost:27017/Inventory';
console.log(SEED)
seeder.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    // seeder.loadModels([ './backend/products/products.model' ]);
    seeder.loadModels([ 
                        './backend/category/category.model',
                        './backend/products/products.model' 
                        ]);
    seeder.clearModels(['Category', 'Product'], () => {
        seeder.populateModels([SEED.Category[0], SEED.Product[0]], (err, done) => {
            if(err) {
                return console.log('Error in seeding Product', err);
            }
            if(done) {
                console.log('Product seed data successful', done);
                return;
            }
            
            seeder.disconnect();
        });
    });
});