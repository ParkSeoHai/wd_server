"use strict"

const { toInteger } = require('lodash');
const { OKResponse, CreatedResponse } = require('../core/success.response');
const ProductService = require("../services/product.service");
const { validObjectId } = require("../validations");

class ProductController {
  getAllProducts = async (req, res, next) => {
    const page = toInteger(req.query.p) || 1;
    const limit = toInteger(req.query.limit) || 10;
    const sort = req.query.sort;
    const searchStr = req.query.s || null;

    const { products, options } = await ProductService.getAll({ searchStr, page, limit, sort });

    new OKResponse({
      message: 'Lấy dữ liệu sản phẩm thành công',
      metadata: products,
      options
    }).send(res);
  }

  createProduct = async (req, res, next) => {
    new CreatedResponse({
      message: 'Tạo sản phẩm mới thành công',
      metadata: await ProductService.createProduct(req.body)
    }).send(res);
  }

  getDetail = async (req, res, next) => {
    const productUrl = req.params.product_url;

    new OKResponse({
      message: 'Lấy dữ liệu chi tiết sản phẩm thành công',
      metadata: await ProductService.getDetail(productUrl.trim().toLowerCase())
    }).send(res);
  }

  getProductsByCategory = async (req, res, next) => {
    const category_url = req.params.category_url;
    const page = toInteger(req.query.p) || 1;
    const limit = toInteger(req.query.limit) || 20;
    const sort = req.query.sort;

    const { products, options, breadCrumbs } = await ProductService.getProductsByCategory({ page, limit, sort, category_url: category_url.trim() });

    new OKResponse({
      message: 'Lấy danh sách sản phẩm theo danh mục thành công',
      metadata: { products, breadCrumbs },
      options
    }).send(res);
  }

  getProductsNew = async (req, res, next) => {
    const page = toInteger(req.query.p) || 1;
    const limit = toInteger(req.query.limit) || 5;

    const { products, options } = await ProductService.getProductsNew({ page, limit });

    new OKResponse({
      message: 'Lấy danh sách sản phẩm mới thành công',
      metadata: { products },
      options
    }).send(res);
  }

  getAllCrud = async (req, res, next) => {
    const { products, options } = await ProductService.getAllCrud(req.body);
    
    new OKResponse({
      message: 'Lấy danh sách sản phẩm thành công',
      metadata: { data: products },
      options
    }).send(res);
  }

  addOrUpdateCrud = async (req, res, next) => {
    new CreatedResponse({
      message: 'Thành công',
      metadata: await ProductService.addOrUpdateCrud(req.body)
    }).send(res);
  }

  getByIdCrud = async (req, res, next) => {
    const productId = req.params.productId;

    new OKResponse({
      message: "Lấy dữ liệu sản phẩm thành công",
      metadata: await ProductService.getByIdCrud(productId)
    }).send(res);
  }

  deleteByIdCrud = async (req, res, next) => {
    new OKResponse({
      message: "Xóa sản phẩm thành công",
      metadata: await ProductService.deleteByIdCrud(req.body)
    }).send(res);
  }
}

module.exports = new ProductController();