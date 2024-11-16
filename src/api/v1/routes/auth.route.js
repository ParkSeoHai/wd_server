"use strict"

const express = require('express');
const asyncHandler = require('../helpers/asyncHandler');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();

router.post("/login", asyncHandler(AuthController.login));
router.post("/register", asyncHandler(AuthController.register));
router.post("/getOTP", asyncHandler(AuthController.getOTP));

module.exports = router;