"use strict"

const express = require('express');
const userController = require('../controllers/user.controller');
const asyncHandler = require('../helpers/asyncHandler');

const router = express.Router();

router.post("/login", asyncHandler(userController.login));
router.post("/register", asyncHandler(userController.register));

module.exports = router