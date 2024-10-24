"use strict"

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "product_image"
const COLLECTION_NAME = "products_images"

const productImageSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, require: true, ref: "product" },
  image_url: { type: String, require: true },
  type: { type: String, require: true, enum: ["thumbnail", "gallery"], default: "gallery" },
  alt_text: String,
  order: { type: Number, require: true }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

module.exports = model(DOCUMENT_NAME, productImageSchema)
