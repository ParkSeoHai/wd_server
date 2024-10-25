"use strict"

const { OKResponse, CreatedResponse } = require('../core/success.response');
const ProductService = require("../services/product.service");
const { validObjectId } = require("../validations");

class ProductController {
  getProducts = async (req, res, next) => {
    new OKResponse({
      message: 'Lấy tất cả dữ liệu sản phẩm thành công',
      metadata: await ProductService.getAll()
    }).send(res);
  }

  createProduct = async (req, res, next) => {
    new CreatedResponse({
      message: 'Tạo sản phẩm mới thành công',
      metadata: await ProductService.createProduct(req.body)
    }).send(res);
  }

  getProductById = async (req, res, next) => {
    const productId = req.params.id;
    validObjectId(productId);

    new OKResponse({
      message: 'Lấy dữ liệu chi tiết sản phẩm thành công',
      metadata: await ProductService.getById(productId)
    }).send(res);
  }
}

module.exports = new ProductController()