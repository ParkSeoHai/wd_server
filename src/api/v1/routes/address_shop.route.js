"use strict"

const express = require('express');
const AddressShopController = require('../controllers/address_shop.controller');
const asyncHandler = require('../helpers/asyncHandler');

const router = express.Router();

router.post("/", asyncHandler(AddressShopController.create));
router.get("/", asyncHandler(AddressShopController.getAddressShops));

module.exports = router