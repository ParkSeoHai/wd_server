const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");

require("dotenv").config();

const app = express();

// init middlewares
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// use router
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

    console.log(error.stack)

    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal Server Error'
    })
})

module.exports = app;
