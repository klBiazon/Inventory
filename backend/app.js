const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mongoose = require('mongoose');
const connectionURL = process.env.DEV_CONNECTION_URL;


//ROUTES
const productsRoutes = require('./products/products.routes');
const userRoutes = require('./user/user.routes');

//CONNECT
mongoose.connect(connectionURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    console.log("MongoDB Connected...");
  })
  .catch((err) => {
    console.log(err)
    console.log("Connection Failed!")
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

//ADDING ROUTES
app.use('/api/products', productsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;