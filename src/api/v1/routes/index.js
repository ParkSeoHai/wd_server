"use strict"

const express = require("express");
const routes = express.Router();

// route product
routes.use("/product", require("./product.route"));
// route product_image
routes.use("/product_image", require("./product_image.route"));
// route product_detail
routes.use("/product_detail", require("./product_detail.route"));
// route user
routes.use("/user", require("./user.route"));
// route customer
routes.use("/customer", require("./customer.route"));
// route category
routes.use("/category", require("./category.route"));
// route address_shop
routes.use("/address_shop", require("./address_shop.route"));

module.exports = routes;
