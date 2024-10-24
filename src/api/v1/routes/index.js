"use strict"

const express = require("express");
const routes = express.Router();

// route product
routes.use("/product", require("./product.route"));
// route user
routes.use("/user", require("./user.route"));
// route customer
routes.use("/customer", require("./customer.route"));
// route category
routes.use("/category", require("./category.route"));

module.exports = routes;
