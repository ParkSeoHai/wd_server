"use strict"

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "user";
const COLLECTION_NAME = "users";

const userSchema = new Schema({
  email: { type: String, unique: true, require: true },
  phone_number: { type: String, require: true },
  password: { type: String, require: true },
  name: { type: String },
  gender: { type: Number, default: null },
  birthday: { type: String, default: null },
  avatar: { type: String, default: null },
  role: { type: String, require: true, enum: ["admin", "customer"], default: "customer" },
  address: [
    {
      name: String,
      country: String,
      city: String,
      quan_huyen: String,
      xa_phuong: String,
      detail: String,
      phone_number: String,
      default: Boolean
    }
  ]
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

module.exports = model(DOCUMENT_NAME, userSchema);
