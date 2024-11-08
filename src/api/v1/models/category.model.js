"use strict"

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "category"
const COLLECTION_NAME = "categories"

const categorySchema = new Schema({
  category_name: { type: String, require: true },
  category_url: { type: String, require: true },
  icon: { type: String, default: null },
  category_description: { type: String, default: '' },
  parent_category_id: { type: Schema.Types.ObjectId, ref: "category", default: null },
  order: { type: Number, require: true }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

module.exports = model(DOCUMENT_NAME, categorySchema)
