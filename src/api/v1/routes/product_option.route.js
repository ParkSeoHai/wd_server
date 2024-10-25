"use strict"

const express = require("express");
const router = express.Router();

const asyncHandler = require("../helpers//asyncHandler");
const ProductOptionController = require("../controllers/product_option.controller");

router.post("/", asyncHandler(ProductOptionController.addProductOption));

module.exports = router;
