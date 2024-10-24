"use strict"

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "cart";
const COLLECTION_NAME = "carts";

const cartSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
    items: [
      {
        product_id: { type: Schema.Types.ObjectId, ref: "product", required: true },
        product_name: { type: String, required: true },
        product_thumb: { type: String, default: null },
        product_price: { type: Number, required: true },
        options: [
          {
            option_name: { type: String, required: true },
            option_value: { type: String, required: true },
            price_adjustment: { type: Number, default: 0 },
          },
        ],
        quantity: { type: Number, required: true, min: 1 },
        total_price: { type: Number, required: true },
      }
    ]
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);
