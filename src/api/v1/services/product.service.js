"use strict"

const productModel = require('../models/product.model');

const { BadRequestError } = require("../core/error.response");

class ProductService {
  static getAllProduct = async () => {
    const products = productModel.find({}).lean()
    return products
  }
}

module.exports = ProductService
