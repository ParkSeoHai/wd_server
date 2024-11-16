"use strict"

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "product_detail"
const COLLECTION_NAME = "product_details"

const productDetailSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "product", require: true },
  attributes: [
    {
      type: { type: String, require: true },
      details: [
        {
          name: { type: String, require: true },
          value: { type: String, require: true }
        }
      ]
    }
  ]
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

module.exports = model(DOCUMENT_NAME, productDetailSchema);
