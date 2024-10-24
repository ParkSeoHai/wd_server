"use strict"

const express = require("express");
const router = express.Router();

const asyncHandler = require("../helpers//asyncHandler");
const ProductController = require("../controllers/product.controller");

// Get all products
router.get("/", asyncHandler(ProductController.getAllProducts));

module.exports = router;
