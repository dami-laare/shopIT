 const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter a product price'],
        default: 0.00,
        maxLength: [5, 'Product price cannot exceed 5 characters']
    },
    desc: {
        type: String,
        required: [true, 'Please enter a product description'],
    },
    rating: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: [true]
            },
            url: {
                type: String,
                required: [true]
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'Please enter a product category'],
        enum: {
            values: [
                'Electronics',
                'Cameras',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message: 'Please select a correct category for this product'
        }
    },
    seller: {
        type: String,
        required: [true, 'Please enter a seller']
    },
    stock: {
        type:Number,
        required: [true, 'Please enter a product stock'],
        maxLength: [5, 'Product stock cannot exceed five characters']
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Product', productSchema)