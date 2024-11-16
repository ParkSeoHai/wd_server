"use strict"

const express = require('express');
const asyncHandler = require('../helpers/asyncHandler');
const CartController = require('../controllers/cart.controller');

const router = express.Router();

router.get("/:userId", asyncHandler(CartController.getCart));
router.post("/", asyncHandler(CartController.addItem));
router.post("/updateQuantityItem", asyncHandler(CartController.updateQuantityItem));
router.post("/removeItem", asyncHandler(CartController.removeItem));

module.exports = router;