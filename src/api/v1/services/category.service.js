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
      const data = getInfoData({collection: "categories", data: category});
      categoryMap[category._id] = { ...data, subcategories: [] };
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

    return {
      categories: result
    };
  }

  static getCategoryByUrl = async (category_url) => {
    const category = await CategoryModel.findOne({category_url}).lean();
    console.log(category)
    if (!category) throw new BadRequestError("Get category by url not found");
    return getInfoData({ collection: "categories", data: category });
  }

  // Hàm lấy danh sách tất cả danh mục con của một danh mục
  static getAllSubcategories = async (categoryId) => {
    const subcategories = await CategoryModel.find({ parent_category_id: categoryId }).lean();
    const allSubcategories = [...subcategories];

    for (const subcategory of subcategories) {
      const childSubcategories = await this.getAllSubcategories(subcategory._id);
      allSubcategories.push(...childSubcategories);
    }

    return getInfoData({ collection: "categories", data: allSubcategories });
  };
}

module.exports = CategoryService;
