const express = require('express')
const errorMiddleware = require('./middlewares/errors')
const app = express()

// Importing routes here
const products = require('./routes/products')

app.use(express.json())
app.use('/api/v1', products);
app.use(errorMiddleware)

module.exports = app;