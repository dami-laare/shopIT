const Product = require('../models/product');

const dotenv = require('dotenv');

const connectDatabase = require('../config/database');

const products = require('../data/products.json');

// Setting up config file
dotenv.config({path: 'backend/config/config.env'});

//Connecting Database
connectDatabase();

const seedProducts = async () => {
    try {
        await Product.deleteMany();
        console.log('All pre-existing products have been deleted');

        await Product.insertMany(products);
        console.log("Dummy data has been added successfully");
        process.exit();

    } catch(error){
        console.log(error.message);
        process.exit();
    }
}

seedProducts();