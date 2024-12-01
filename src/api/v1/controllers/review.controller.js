"use strict"

const { OKResponse, CreatedResponse } = require('../core/success.response');
const ReviewService = require("../services/review.service");

class UserController {
    getReview = async (req, res, next) => {
        new OKResponse({
            message: "Lấy dữ liệu thành công",
            metadata: await ReviewService.getReviewByProductId(req.body)
        }).send(res);
    }

    addReview = async (req, res, next) => {
        new CreatedResponse({
            message: "Đánh giá sản phẩm thành công",
            metadata: await ReviewService.addReview(req.body)
        }).send(res);
    }
}

module.exports = new UserController();