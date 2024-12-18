"use strict"

const express = require("express");
const router = express.Router();

const asyncHandler = require("../helpers//asyncHandler");
const ProductController = require("../controllers/product.controller");

// Get products
router.get("/", asyncHandler(ProductController.getAllProducts));
// Get products by category
router.get("/category/:category_url", asyncHandler(ProductController.getProductsByCategory));
// Get product detail
router.get("/:product_url", asyncHandler(ProductController.getDetail));
// Get product new
router.get("/new/all", asyncHandler(ProductController.getProductsNew));
// Create product
router.post("/", asyncHandler(ProductController.createProduct));

// Get all products crud
router.post("/crud/getAll", asyncHandler(ProductController.getAllCrud));
router.get("/crud/getById/:productId", asyncHandler(ProductController.getByIdCrud));
router.post("/crud/addOrUpdate", asyncHandler(ProductController.addOrUpdateCrud));
router.post("/crud/deleteById", asyncHandler(ProductController.deleteByIdCrud));

module.exports = router;
