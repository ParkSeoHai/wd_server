"use strict"

const express = require("express");
const router = express.Router();

const asyncHandler = require("../helpers//asyncHandler");
const reviewController = require("../controllers/review.controller");

// get review
router.post("/getReview", asyncHandler(reviewController.getReview));
// add review
router.post("/addReview", asyncHandler(reviewController.addReview));

module.exports = router;