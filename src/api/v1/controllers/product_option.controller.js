"use strict"

const { OKResponse, CreatedResponse } = require('../core/success.response');
const ProductOptionService = require("../services/product_option.service");

class ProductOptionController {

  addProductOption = async (req, res, next) => {
    new CreatedResponse({
      message: 'Thêm tùy chọn sản phẩm thành công',
      metadata: await ProductOptionService.addProductOption(req.body)
    }).send(res);
  }
}

module.exports = new ProductOptionController();