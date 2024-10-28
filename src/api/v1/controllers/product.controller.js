"use strict"

const { OKResponse, CreatedResponse } = require('../core/success.response');
const ProductService = require("../services/product.service");
const { validObjectId } = require("../validations");

class ProductController {
  getProductsPagination = async (req, res, next) => {
    const page = req.query.p || 1;
    const limit = req.query.limit || 10;

    new OKResponse({
      message: 'Lấy tất cả dữ liệu sản phẩm thành công',
      metadata: await ProductService.getWithPagination({ page, limit }),
      options: {
        page, limit,
        totalSize: await ProductService.getCountDocument({ query: { publish: true } })
      }
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

  getProductsByCategory = async (req, res, next) => {
    const category_url = req.params.category_url;

    new OKResponse({
      message: 'Lấy danh sách sản phẩm theo danh mục thành công',
      metadata: await ProductService.getProductsByCategory(category_url.trim())
    }).send(res);
  }
}

module.exports = new ProductController();