"use strict"

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "flash_sale";
const COLLECTION_NAME = "flash_sales";

const flashSaleSchema = new Schema(
  {
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    flash_sale_items: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        discount: { type: Number, required: true, min: 0, max: 100 },
        quantity_sale: { type: Number, required: true, min: 0 },
        quantity_sold: { type: Number, default: 0, min: 0 },
      }
    ]
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, flashSaleSchema);
