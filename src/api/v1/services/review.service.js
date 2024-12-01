"use strict"

const ReviewModel = require('../models/review.model');
const ProductSummaryModel = require('../models/product_rating_summary.model');
const { BadRequestError, InternalServerError } = require("../core/error.response");
const { getInfoData, uploadFileImg, formatIsoDateToDateTime } = require('../utils');
const ProductService = require('./product.service');
const UserService = require('./user.service');

class ReviewService {
    static getReviewByProductId = async ({ productId }) => {
        // check product
        const foundProduct = await ProductService.checkProduct(productId);
        // get review
        const review = await ReviewModel.find({ product_id: foundProduct._id });
        if (review.length === 0) {
            return null;
        }
        // get info user review
        await Promise.all(review.map(async (item, index) => {
            review[index] = getInfoData({ collection: "reviews", data: item });
            review[index].user = await UserService.getInfoReview(item.user_id);
            // format datetime
            review[index].createdAt = formatIsoDateToDateTime(item.createdAt);
        }));
        // get rating summary
        const ratingSummary = await ProductSummaryModel.findOne({ product_id: foundProduct._id }).lean();
        return {
            comments: review,
            summary: getInfoData({ collection: "rating_summary", data: ratingSummary })
        };
    }

    static addReview = async ({ productId, userId, rating, review_text, imageReviews = [] }) => {
        // check product
        const foundProduct = await ProductService.checkProduct(productId);
        // check user
        const foundUser = await UserService.findById(userId);
        // check if user was review
        const checkUserReview = await ReviewModel.findOne({ 
            product_id: foundProduct._id, user_id: foundUser._id
        })
        if (checkUserReview) throw new BadRequestError("Bạn đã đánh giá sản phẩm này");
        // upload image review to cloudinary
        await Promise.all(imageReviews.map(async (file, index) => {
            const res = await uploadFileImg(file, "wdsmart-review");
            imageReviews[index] = res.url;
        }));
        // add to review
        const reviewNew = await ReviewModel.create({
            product_id: foundProduct._id, user_id: foundUser._id,
            rating, review_text, imageReviews
        });
        // update product rating sumary
        await this.updateProductRatingSummary(foundProduct._id, rating);
        if (!reviewNew) throw new BadRequestError("Đánh giá sản phẩm thất bại");
        return reviewNew;
    }

    static updateProductRatingSummary = async (productId, rating) => {
        const ratingMap = {
            1: "one_star",
            2: "two_star",
            3: "three_star",
            4: "four_star",
            5: "five_star",
        };

        const ratingField = ratingMap[rating];
        if (!ratingField) {
            throw new Error("Số sao không hợp lệ. Vui lòng chọn từ 1 đến 5 sao.");
        }

        // Kiểm tra xem tài liệu đã tồn tại chưa
        const existingSummary = await ProductSummaryModel.findOne({ product_id: productId });

        if (!existingSummary) {
            // Nếu chưa tồn tại, khởi tạo tài liệu mới
            await ProductSummaryModel.create({
                product_id: productId,
                total_reviews: 0,
                average_rating: 0,
                ratings_by_stars: {
                    one_star: 0,
                    two_star: 0,
                    three_star: 0,
                    four_star: 0,
                    five_star: 0,
                },
            });
        }

        // Cập nhật tài liệu
        const updatedSummary = await ProductSummaryModel.findOneAndUpdate(
            { product_id: productId },
            {
                $inc: {
                    total_reviews: 1,
                    [`ratings_by_stars.${ratingField}`]: 1,
                },
            },
            { new: true }
        );

        // Tính lại điểm trung bình
        const { ratings_by_stars, total_reviews } = updatedSummary;
        const totalPoints =
            ratings_by_stars.one_star * 1 +
            ratings_by_stars.two_star * 2 +
            ratings_by_stars.three_star * 3 +
            ratings_by_stars.four_star * 4 +
            ratings_by_stars.five_star * 5;

        updatedSummary.average_rating = totalPoints / total_reviews;

        await updatedSummary.save();

        return updatedSummary;
    };

}

module.exports = ReviewService;
