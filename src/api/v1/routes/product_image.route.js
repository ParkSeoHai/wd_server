"use strict"

const express = require("express");
const router = express.Router();

const asyncHandler = require("../helpers//asyncHandler");
const ProductImageController = require("../controllers/product_image.controller");

router.post("/", asyncHandler(ProductImageController.createProductImage));

module.exports = router;
