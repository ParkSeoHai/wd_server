"use strict"

const { OKResponse, CreatedResponse } = require('../core/success.response');
const ProductImageService = require("../services/product_image.service");

class ProductImageController {

  createProductImage = async (req, res, next) => {
    new CreatedResponse({
      message: 'Thêm hình ảnh sản phẩm mới thành công',
      metadata: await ProductImageService.createProductImage(req.body)
    }).send(res);
  }
}

module.exports = new ProductImageController();