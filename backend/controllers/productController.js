const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const APIFeatures = require('../utils/apiFeatures')

// Post new product to the database
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.createdBy = req.user;
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})

// Get all products in the database => /api/v1/products?keyword=apple
exports.getProducts = catchAsyncErrors(async (req, res, next) => {

    const resPerPage = 4

    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resPerPage)

    const products = await apiFeatures.query;
    
    res.status(200).json({
        success: true,
        count: products.length,
        message: "This route shows all products on the database",
        products
    })
})

// Get a single product from the database => /api/v1/product/:id

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Product not found', 404))
    }
    res.status(200).json({
        success: true,
        product
    })
})

// Find a single product by Id and update => /api/v1/product/:id

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        console.log(product);
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    } 

    await Product.findByIdAndUpdate(req.params.id,req.body, {
        new: true,
        useFindAndModify: false,
        runValidators: true
    });

    res.status(201).json({
        success: true,
        message: "Successfully updated product"
    })
})

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
        console.log(product);
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    } 

    await product.remove();
    
    res.status(200).json({
        success: true,
        message: 'Successfully deleted selected product'
    })
})