"use strict"

const ProductOptionModel = require('../models/product_option.model');

const { BadRequestError } = require("../core/error.response");

class ProductOptionService {

  static addProductOption = async ({ product_id, option_name, option_values, order }) => {
    const newProductOption = await ProductOptionModel.create({
        product_id, option_name, option_values, order
    });

    if (!newProductOption) throw new BadRequestError("Thêm tùy chọn sản phẩm thất bại");

    return newProductOption;
  }
}

module.exports = ProductOptionService;
