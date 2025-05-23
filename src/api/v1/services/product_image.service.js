"use strict"

const ProductImageModel = require('../models/product_image.model');
const { BadRequestError } = require("../core/error.response");
const { getInfoData } = require('../utils');

class ProductImageService {

  static createProductImage = async ({ product_id, image_url, type, alt_text, order }) => {
    const newProductImage = await  ProductImageModel.create({
        product_id, image_url, type, alt_text, order
    });

    if (!newProductImage) throw new BadRequestError("Thêm hình ảnh sản phẩm mới thất bại");

    return newProductImage;
  }

  static findByProductId = async ({ productId, type = "any" }) => {
    let productImages = [];

    if (type !== "any") {
      productImages = await ProductImageModel.find({
        product_id: productId, type
      }).lean();
    } else {
      productImages = await ProductImageModel.find({
        product_id: productId
      }).lean();
    }
    return getInfoData({ collection: "product_images", data: productImages });
  }

  static removeAllByProductId = async ({ product_id, type = "any" }) => {
    if (type !== "any") {
      await ProductImageModel.deleteMany({
        product_id, type
      });
    } else {
      await ProductImageModel.deleteMany({
        product_id
      });
    }
  }
}

module.exports = ProductImageService;
