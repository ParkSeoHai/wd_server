"use strict"

const express = require('express');
const CategoryrController = require('../controllers/category.controller');
const asyncHandler = require('../helpers/asyncHandler');

const router = express.Router();

router.get("/", asyncHandler(CategoryrController.getCategories));

router.get("/sub/:category_url", asyncHandler(CategoryrController.getSubCategories));

router.post("/", asyncHandler(CategoryrController.create));

// get all categories crud
router.get("/getAllCategories", asyncHandler(CategoryrController.getAllCategories));

module.exports = router