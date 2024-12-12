"use strict"

const express = require('express');
const userController = require('../controllers/user.controller');
const asyncHandler = require('../helpers/asyncHandler');

const router = express.Router();

router.get("/account/:userId", asyncHandler(userController.getAccount));
router.post("/account/update", asyncHandler(userController.updateInfoAccount));
router.post("/customerAddress", asyncHandler(userController.addCustomerAddress));
router.post("/customerAddress/update", asyncHandler(userController.updateCustomerAddress));
router.post("/customerAddress/remove", asyncHandler(userController.removeCustomerAddress));

// router crud
router.post("/crud/getAll", asyncHandler(userController.getAllCrud));
router.get("/crud/getById/:userId", asyncHandler(userController.getByIdCrud));
router.post("/crud/addOrUpdate", asyncHandler(userController.addOrUpdateCrud));

module.exports = router