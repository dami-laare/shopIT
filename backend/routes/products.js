const express = require('express')

const router = express.Router();

const { 
    newProduct, 
    getProducts, 
    getSingleProduct, 
    updateProduct, 
    deleteProduct } = require('../controllers/productController');
const { isAuthenticated, isAuthorized } = require('../middlewares/auth');
    

router.route('/products').get(isAuthenticated, isAuthorized("admin"), getProducts);

router.route('/admin/product/new').post(isAuthenticated, isAuthorized("admin"),newProduct);

router.route('/product/:id').get(getSingleProduct)

router.route('/admin/product/:id').put(isAuthenticated, isAuthorized("admin"), updateProduct).delete(isAuthenticated, isAuthorized("admin"), deleteProduct);

module.exports = router