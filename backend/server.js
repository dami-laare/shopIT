const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');


// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`ERROR: ${err.stack}`)
    console.log('Server shutting down due to uncaught exception')
    process.exit(1)
})

// Setting up config file
dotenv.config({path: 'backend/config/config.env'})


// Connect to Database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

// Handling unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`ERROR: ${err.message}`);
    console.log(`Shutting down server due to unhandled rejection`)
    server.close(() => {
        process.exit(1);
    })
})