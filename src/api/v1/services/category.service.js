"use strict"

const CategoryModel = require('../models/category.model');
const { BadRequestError } = require("../core/error.response");
const { getInfoData } = require('../utils');

class CategoryService {
  static create = async ({ category_name, icon, category_description, parent_category_id }) => {

    const newCategory = await CategoryModel.create({
      category_name, icon, category_description, parent_category_id
    })

    if (!newCategory) throw new BadRequestError("Thêm mới danh mục thất bại");

    return newCategory;
  }

  static getCategories = async () => {
    // Lấy tất cả danh mục
    const categories = await CategoryModel.find({}).lean();

    // Phân loại danh mục cha và con
    const categoryMap = {};
    categories.forEach(category => {
      const data = getInfoData({fields: ["_id", "category_name", "icon", "category_description"], object: category});
      categoryMap[category._id] = { data, subcategories: [] };
    });

    const result = [];
    categories.forEach(category => {
      if (category.parent_category_id) {
        // Nếu là danh mục con, thêm vào danh sách con của danh mục cha
        categoryMap[category.parent_category_id].subcategories.push(categoryMap[category._id]);
      } else {
        // Nếu là danh mục cha, thêm vào kết quả
        result.push(categoryMap[category._id]);
      }
    });

    return result;
  }
}

module.exports = CategoryService;
