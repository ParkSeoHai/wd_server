"use strict"

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "product_option";
const COLLECTION_NAME = "product_options";

const productOptionSchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    option_name: { type: String, required: true },
    option_values: [
      {
        value: { type: String, required: true },
        price_adjustment: { type: Number, default: 0 },
        quantity_available: { type: Number, required: true, default: 0 },
      },
    ],
    order: { type: Number },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, productOptionSchema)
