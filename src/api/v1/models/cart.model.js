"use strict"

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "cart";
const COLLECTION_NAME = "carts";

const CartItemOptionSchema = new Schema({
  option_id: { type: Schema.Types.ObjectId, required: true },
  option_name: { type: String, required: true },
  option_value: { type: String, required: true },
  sub_option: {
    type: Schema.Types.Mixed,
    default: null,
  }
});

const CartItemSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "product", required: true },
  option: CartItemOptionSchema,
  quantity: { type: Number, required: true }
});

const cartSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
    cart_items: [CartItemSchema],
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);
