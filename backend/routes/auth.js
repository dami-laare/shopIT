const express = require('express');

const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    logoutUser, 
    forgotPassword, 
    resetPassword,
    getUserProfile, 
    updatePassword,
    updateProfile,
    getAllUsers,
    getSingleUser,
    adminUpdateUser,
    deleteUser
} = require('../controllers/authController');

const { isAuthenticated, isAuthorized } = require('../middlewares/auth')

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/reset').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticated, getUserProfile);
router.route('/password/update').put(isAuthenticated, updatePassword);
router.route('/myprofile/update').put(isAuthenticated, updateProfile);
router.route('/admin/users').get(isAuthenticated, isAuthorized('admin'), getAllUsers);
router.route('/admin/user/:id').get(isAuthenticated, isAuthorized('admin'), getSingleUser);
router.route('/admin/user/:id').put(isAuthenticated, isAuthorized('admin'), adminUpdateUser).delete(isAuthenticated, isAuthorized('admin'), deleteUser);



module.exports = router;