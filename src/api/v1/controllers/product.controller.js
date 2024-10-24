"use strict"

const { SuccessResponse } = require('../core/success.response');
const ProductService = require("../services/product.service");

class ProductController {
  getAllProducts = async (req, res, next) => {
    // v2
    new SuccessResponse({
        message: 'Get all product success',
        metadata: await ProductService.getAllProduct()
    }).send(res)
  }
}

module.exports = new ProductController()