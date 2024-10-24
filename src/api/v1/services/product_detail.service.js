"use strict"

const ProductDetailModel = require('../models/product_detail.model');

const { BadRequestError } = require("../core/error.response");

class ProductImageService {

  static createProductDetail = async ({ product_id, attributes }) => {
    const newProductDetail = await ProductDetailModel.create({ product_id, attributes });

    if (!newProductDetail) throw new BadRequestError("Thêm chi tiết sản phẩm mới thất bại");

    return newProductDetail;
  }
}

module.exports = ProductImageService;
