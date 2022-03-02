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


    const resPerPage = 8

    const productCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resPerPage)

    const products = await apiFeatures.query;
    
    res.status(200).json({
        success: true,
        message: "This route shows all products on the database",
        products,
        productCount,
        productFilterCount: products.length,
        resPerPage
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

// Delete a product. => /api/v1/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if(!product) {
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

// Create a product review => api/v1/product/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {    
    const { rating, comment, productId } = req.body;
    
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }
    const product = await Product.findById(productId);

    if(!product) {
        return next(new ErrorHandler('Product does not exist', 400));
    }

    const isReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());

    if(isReviewed){
        product.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment;
                review.rating = rating;
            }
        })
    }else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.rating = product.reviews.reduce((acc, review) => review.rating + acc, 0) / product.reviews.length
    
    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        product
    })
})

// Get all reviews for a product => api/v1/product/reviews/:id
exports.getProductsReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Product does not exist', 400));
    };

    res.status(200).json({
        success: true,
        name: product.name,
        reviews: product.reviews
    })
})

// Delete review => api/v1/product/review
exports.deleteProductReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    const isReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());

    if(!isReviewed) {
        return next(new ErrorHandler('You have no reviews for this product'), 400)
    }
    
    const reviews = product.reviews.filter(review => {
        return review.user.toString() !== req.user._id.toString()
    })

    const numOfReviews = reviews.length;

    if(numOfReviews === 0){
        return next(new ErrorHandler('This product has no reviews'), 400)
    }

    const rating = reviews.reduce((acc, review) => review.rating + acc, 0) / reviews.length;

    await Product.findByIdAndUpdate(req.query.id, {
        reviews,
        numOfReviews,
        rating,
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "Review successfully deleted"
    })
})