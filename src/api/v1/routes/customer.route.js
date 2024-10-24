"use strict"

const express = require('express');
const CustomerController = require('../controllers/customer.controller');
const asyncHandler = require('../helpers/asyncHandler');

const router = express.Router();

router.post("/", asyncHandler(CustomerController.createCustomer));

module.exports = router