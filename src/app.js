const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const cors = require("cors");

require("dotenv").config();

const app = express();

// enabling CORS for any unknown origin(https://xyz.example.com)
app.use(cors());

// init middlewares
app.use(express.json());
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
