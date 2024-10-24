"use strict"

const express = require('express');
const CategoryrController = require('../controllers/category.controller');
const asyncHandler = require('../helpers/asyncHandler');

const router = express.Router();

router.get("/", asyncHandler(CategoryrController.getCategories));
router.post("/", asyncHandler(CategoryrController.create));

module.exports = router