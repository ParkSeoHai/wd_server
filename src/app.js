const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

require("dotenv").config();

const app = express();

// enabling CORS for any unknown origin(https://xyz.example.com)
app.use(cors());

// init middlewares
app.use(express.json({
    limit: "50mb"
}));
app.use(express.urlencoded({
    extended: true
}))
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// use router
app.get("/", (req, res, next) => res.send(`Welcome to wd-shop api`))
app.use(require("./api/routes"));

// init db
require('./api/v1/dbs/init.mongo');
// config cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true,
});

// handling error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500

    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error',
        stack: error.stack
    })
})

module.exports = app;
