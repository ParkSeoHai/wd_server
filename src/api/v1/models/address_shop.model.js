"use strict"

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "address_shop";
const COLLECTION_NAME = "address_shops";

const addressShopSchema = new Schema(
  {
    name_shop: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    quan_huyen: { type: String, required: true },
    xa_phuong: { type: String, required: true },
    detail: { type: String, required: true },
    phone_number: { type: String, required: true },
    uptime: { type: String, required: true },
    url_map: { type: String, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, addressShopSchema);