"use strict"

const ProductOptionModel = require('../models/product_option.model');

const { BadRequestError } = require("../core/error.response");
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
    const productOptions = await ProductOptionModel.findOne({product_id: productId}).lean();
    return getInfoData({ collection: "product_options", data: productOptions });
  }
}

module.exports = ProductOptionService;
