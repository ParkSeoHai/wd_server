"use strict"

const express = require('express');
const asyncHandler = require('../helpers/asyncHandler');
const FlashSaleController = require('../controllers/flash_sale.controller');

const router = express.Router();

// Get flash sale
router.get("/", asyncHandler(FlashSaleController.getFlashSale));

router.post("/", asyncHandler(FlashSaleController.createFlashSale));

module.exports = router;