"use strict"

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "product";
const COLLECTION_NAME = "products";

const productSchema = new Schema({
  product_name: { type: String, require: true },
  product_url: { type: String, require: true },
  product_description: String,
  product_price: { type: Number, require: true, default: 0 },
  product_quantity: { type: Number, require: true, default: 0 },
  product_discount: { type: Number, default: 0 },
  publish: { type: Boolean, require: true, default: true },
  brand_name: { type: String, require: true },
  category_id: { type: Schema.Types.ObjectId, require: true, ref: "category" },
  product_type: { type: String, require: true, enum: [
    "mobiles", "tablets", "laptops", "sounds", "watches", "accessories"
  ] }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

module.exports = model(DOCUMENT_NAME, productSchema);
