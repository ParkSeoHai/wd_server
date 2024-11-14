"use strict"

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "product_favorite";
const COLLECTION_NAME = "product_favorites";

const productFavoriteSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, require: true, ref: "user" },
  favorite_items: [
    {
      product_id: { type: Schema.Types.ObjectId, ref: "product" },
    }
  ]
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

module.exports = model(DOCUMENT_NAME, productFavoriteSchema);
