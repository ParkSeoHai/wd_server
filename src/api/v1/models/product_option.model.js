"use strict"

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "product_option";
const COLLECTION_NAME = "product_options";

// Schema cho các tùy chọn con trong từng giá trị tùy chọn (ví dụ: "Dung lượng", "RAM")
const SubOptionSchema = new Schema({
  option_name: { type: String, required: true },
  option_values: [
    {
      value: { type: String, required: true },
      price_adjustment: { type: Number, default: 0 },
      stock: { type: Number, default: 0 },
      shops_available: [
        {
          address: String,
          phone_number: String,
          url_map: String
        }
      ],
      sub_options: { type: Array, default: [] }
    }
  ]
});

// Schema cho các giá trị của tùy chọn chính (ví dụ: "Màu sắc")
const OptionValueSchema = new Schema({
  value: { type: String, required: true },
  image: { type: String },
  price_adjustment: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  shops_available: [
    {
      address: String,
      phone_number: String,
      url_map: String
    }
  ],
  sub_options: SubOptionSchema
});

const productOptionSchema = new Schema(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    option_name: { type: String, required: true },
    option_values: [OptionValueSchema]
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, productOptionSchema);
