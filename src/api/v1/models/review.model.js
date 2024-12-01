"use strict"

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "review";
const COLLECTION_NAME = "reviews";

const reviewSchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, require: true, ref: "product" },
    user_id: { type: Schema.Types.ObjectId, require: true, ref: "user" },
    rating: { type: Number, require: true, default: 0 },
    review_text: { type: String, require: true },
    imageReviews: { type: Array, default: [] }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

module.exports = model(DOCUMENT_NAME, reviewSchema);
