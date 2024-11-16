"use strict"

const express = require('express');
const CustomerController = require('../controllers/customer.controller');
const asyncHandler = require('../helpers/asyncHandler');

const router = express.Router();

router.post("/", asyncHandler(CustomerController.createCustomer));
// get favorite
router.get("/favorite/:userId", asyncHandler(CustomerController.getFavorite));
// check product in favorite
router.post("/favorite/checkItem", asyncHandler(CustomerController.checkFavoriteItem));
// add product to favorite
router.post("/favorite/addItem", asyncHandler(CustomerController.addFavorite));
// remove product in favorite
router.post("/favorite/removeItem", asyncHandler(CustomerController.removeFavoriteItem));

module.exports = router