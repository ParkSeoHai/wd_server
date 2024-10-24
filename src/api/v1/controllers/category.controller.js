"use strict"

const { OKResponse, CreatedResponse } = require('../core/success.response');
const CategoryService = require("../services/category.service");

class CategoryController {

  create = async (req, res, next) => {
    new CreatedResponse({
      message: "Thêm danh mục mới thành công",
      metadata: await CategoryService.create(req.body)
    }).send(res);
  }

  getCategories = async (req, res, next) => {
    new OKResponse({
      message: "Lấy dữ liệu danh mục thành công",
      metadata: await CategoryService.getCategories()
    }).send(res);
  }
}

module.exports = new CategoryController();