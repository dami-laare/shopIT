const express = require('express')
const errorMiddleware = require('./middlewares/errors')
const app = express()
const cookieParser = require('cookie-parser');
// Importing routes here
const products = require('./routes/products')
const auth = require('./routes/auth');


app.use(express.json());
app.use(cookieParser());
app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use(errorMiddleware)

module.exports = app;