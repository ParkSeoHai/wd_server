"use strict"

const ProductOptionModel = require('../models/product_option.model');

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { getInfoData } = require('../utils');

class ProductOptionService {

  static addProductOption = async ({ product_id, option_name, option_values }) => {
    const newProductOption = await ProductOptionModel.create({
      product_id, option_name, option_values
    });

    if (!newProductOption) throw new BadRequestError("Thêm tùy chọn sản phẩm thất bại");

    return newProductOption;
  }

  static findByProductId = async (productId) => {
    const productOptions = await this.getByProductId(productId);
    return getInfoData({ collection: "product_options", data: productOptions });
  }

  static getByProductId = async (productId) => {
    const option = await ProductOptionModel.findOne({product_id: productId});
    if (!option) throw new NotFoundError("Option không tồn tại");
    return option;
  }
}

module.exports = ProductOptionService;
