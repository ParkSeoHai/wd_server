"use strict"

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "order";
const COLLECTION_NAME = "orders";

const orderSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
    order_items: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        product_name: { type: String, required: true },
        product_thumb: { type: String, required: true },
        product_price: { type: String, required: true },
        options: [
          {
            option_name: { type: String, required: true },
            option_value: { type: String, required: true },
          },
        ],
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    total_amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Chờ xử lý", "Đã xác nhận", "Đang giao hàng", "Hoàn thành"],
      default: "Chờ xử lý",
    },
    payment_method: {
      type: String,
      enum: ["Thanh toán khi nhận hàng", "Thẻ tín dụng", "Ví điện tử"],
      required: true,
    },
    shipping_address: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      quan_huyen: { type: String, required: true },
      xa_phuong: { type: String, required: true },
      detail: { type: String, required: true },
      phone_number: { type: String, required: true },
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, orderSchema)
