const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const sendToken = require('../utils/jwt');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');


// Register a new user api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    let user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'vibes',
            url: 'vibes'
        },
        role,
    })

    sendToken(user, 201, res);
});

// Login user /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password, role } = req.body;

    if(!email || !password){
        return next(new ErrorHandler('Please enter your username and password', 401));
    }

    // Find user in the database
    const user = await User.findOne({email}).select('+password')

    if(!user) {
        return next(new ErrorHandler('Invalid username or password', 401))
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler('Invalid username or password', 401));
    }
    sendToken(user, 201, res);

});

// Logout user /api/v1/logout

exports.logoutUser = catchAsyncErrors( async (req, res, next) => {
    const { token } = req.cookies;

    if(!token){
        return next(new ErrorHandler('You are already logged out', 400))
    };

    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).status(200).json({
        success: true,
        message: 'You have successfully logged out'
    });
});

// Reset forgot password /api/v1/password/reset

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user) {
        return next(new ErrorHandler('Invalid email address', 404));
    };

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Define reset URL 

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Here is your reset password link:\n\n${resetUrl}\n\nClick the link to reset your password\n\nIf you did not request to reset your password, kindly ignore this email. Thank you.`

    try {
        await sendEmail(
            {
                email: user.email,
                subject: 'ShopIt Password Recovery',
                message
            }
        )

        res.status(201).json({
            success: true,
            message: `Email sent to ${user.email}`
        })
    } catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return(next(new ErrorHandler(error.message, 500)));
    }

})


// Reset user password /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // Hash url token 
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    // Find user with the same resetPasswordToken
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if(!user) {
        return next(new ErrorHandler('Password token is invalid or has expired', 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Passwords do not match', 400))
    }

    // Set a new password

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
})

