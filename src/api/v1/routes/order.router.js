"use strict"

const express = require('express');
const asyncHandler = require('../helpers/asyncHandler');
const OrderController = require('../controllers/order.controller');

const router = express.Router();

router.get("/:userId", asyncHandler(OrderController.getOrder));
router.post("/", asyncHandler(OrderController.addOrder));

module.exports = router;