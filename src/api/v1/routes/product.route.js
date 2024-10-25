"use strict"

const express = require("express");
const router = express.Router();

const asyncHandler = require("../helpers//asyncHandler");
const ProductController = require("../controllers/product.controller");

// Get all products
router.get("/", asyncHandler(ProductController.getProducts));

// Get product detail
router.get("/:id", asyncHandler(ProductController.getProductById));

router.post("/", asyncHandler(ProductController.createProduct));

module.exports = router;
