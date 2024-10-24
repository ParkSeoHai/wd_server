"use strict"

const { OKResponse, CreatedResponse } = require('../core/success.response');
const ProductDetailService = require("../services/product_detail.service");

class ProductDetailController {

  createProductDetail = async (req, res, next) => {
    new CreatedResponse({
      message: 'Thêm chi tiết sản phẩm mới thành công',
      metadata: await ProductDetailService.createProductDetail(req.body)
    }).send(res);
  }
}

module.exports = new ProductDetailController();