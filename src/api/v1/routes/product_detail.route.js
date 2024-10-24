"use strict"

const express = require("express");
const router = express.Router();

const asyncHandler = require("../helpers//asyncHandler");
const ProductDetailController = require("../controllers/product_detail.controller");

router.post("/", asyncHandler(ProductDetailController.createProductDetail));

module.exports = router;
