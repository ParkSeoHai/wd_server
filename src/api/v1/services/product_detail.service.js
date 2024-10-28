"use strict"

const ProductDetailModel = require('../models/product_detail.model');

const { BadRequestError } = require("../core/error.response");
const { getInfoData } = require('../utils');

class ProductImageService {

  static createProductDetail = async ({ product_id, attributes }) => {
    const newProductDetail = await ProductDetailModel.create({ product_id, attributes });

    if (!newProductDetail) throw new BadRequestError("Thêm chi tiết sản phẩm mới thất bại");

    return newProductDetail;
  }

  static findByProductId = async (productId) => {
    const productDetail = await ProductDetailModel.find({product_id: productId}).lean();
    return getInfoData({ collection: "product_details", data: productDetail });
  }
}

module.exports = ProductImageService;
