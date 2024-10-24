"use strict"

const ProductImageModel = require('../models/product_image.model');

const { BadRequestError } = require("../core/error.response");

class ProductImageService {

  static createProductImage = async ({ product_id, image_url, type, alt_text, order }) => {
    const newProductImage = await  ProductImageModel.create({
        product_id, image_url, type, alt_text, order
    });

    if (!newProductImage) throw new BadRequestError("Thêm hình ảnh sản phẩm mới thất bại");

    return newProductImage;
  }
}

module.exports = ProductImageService;
