const express = require('express');
const router = express.Router();
const { newOrder, myOrders, getSingleOrder, getAllOrders, updateOrder, deleteOrder } = require('../controllers/orderController');
const { isAuthenticated, isAuthorized } = require('../middlewares/auth');


router.route('/order/new').post(isAuthenticated, newOrder);
router.route('/orders/me').get(isAuthenticated, myOrders);
router.route('/admin/orders').get(isAuthenticated, isAuthorized('admin'), getAllOrders);
router.route('/admin/order/:id').get(isAuthenticated, isAuthorized('admin'), getSingleOrder)
                                .put(isAuthenticated, isAuthorized('admin'), updateOrder)
                                .delete(isAuthenticated, isAuthorized('admin'), deleteOrder);

module.exports = router;
