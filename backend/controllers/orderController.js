const mongoose = require('mongoose');
const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');


// Create a new order => /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        totalItemsPrice,
        taxPrice,
        shippingPrice,
        paymentInfo,
    } = req.body;

    const totalPrice = totalItemsPrice + taxPrice + shippingPrice; 

    const order = await Order.create({
        orderItems,
        shippingInfo,
        totalItemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })
})

// Get all orders of logged in user => /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id});

    if (orders.length < 1){
        return next(new ErrorHandler("Oops, you haven't made any orders yet", 404));
    }

    res.status(200).json({
        success: true,
        orders
    })
})

// Get single order by ID => /api/v1/orders/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user','name email');

    if(!order) {
        return next(new ErrorHandler('Order does not exist', 404))
    }

    res.status(200).json({
        success: true,
        order
    })
})

// Gets all orders => /api/v1/admin/orders
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success: true,
        totalNumberOfOrders: orders.length,
        totalAmount,
        orders
    })
})

// This function updates the stock for each of the products that has been ordered
async function updateStock(id, qty) {
    const product = await Product.findById(id);

    product.stock = product.stock - qty;

    await product.save();
}

// Update and process an order => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler('Order does not exist', 400))
    }

    if(order.orderStatus === 'Delivered'){
        return next(new ErrorHandler('This order has already been delivered', 400));
    };

    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();
    await order.save();

    res.status(200).json({
        success: true,
        order
    })
})

// Delete order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler('Order does not exist', 400));
    };

    await order.remove();

    res.status(200).json({
        success: true,
        "message": "Order has been successfully deleted"
    })
})