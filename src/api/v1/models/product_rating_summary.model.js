"use strict"

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "product_rating_summary";
const COLLECTION_NAME = "product_ratings_summary";

const productRatingSumarySchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, require: true, ref: "product" },
    total_reviews: { type: Number, require: true, default: 0 },
    average_rating: { type: Number, require: true, default: 0 },
    ratings_by_stars: { 
      one_star: { type: Number, default: 0 },
      two_star: { type: Number, default: 0 },
      three_star: { type: Number, default: 0 },
      four_star: { type: Number, default: 0 },
      five_star: { type: Number, default: 0 },
    }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

module.exports = model(DOCUMENT_NAME, productRatingSumarySchema);
