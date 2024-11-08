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
    const categories = await CategoryModel.find({}).sort({ order: 1 }).lean();

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
    const category = await CategoryModel.findOne({category_url: { $regex: category_url, $options: 'i' }}).lean();
    if (!category) throw new BadRequestError("Get category by url not found");
    return getInfoData({ collection: "categories", data: category });
  }

  static getCategoryById = async (category_id) => {
    const category = await CategoryModel.findOne({ _id: category_id }).lean();
    if (!category) throw new BadRequestError("Get category by id not found");
    return getInfoData({ collection: "categories", data: category });
  }

  // Hàm lấy danh sách danh mục con cấp tiếp theo của 1 danh mục
  static getSubcategories = async (categoryUrl) => {
    const category = await CategoryModel
      .findOne({category_url: { $regex: categoryUrl, $options: 'i' }}).lean();
    if (!category) throw new BadRequestError("Get category by url not found");

    const subcategories = await CategoryModel
      .find({ parent_category_id: category._id })
      .sort({ order: 1 }).lean();
    return getInfoData({ collection: "categories", data: subcategories });
  }

  // Hàm lấy danh sách tất cả danh mục con của một danh mục
  static getAllSubcategories = async (categoryId) => {
    const subcategories = await CategoryModel.find({ parent_category_id: categoryId }).sort({ order: 1 }).lean();
    const allSubcategories = [...subcategories];

    for (const subcategory of subcategories) {
      const childSubcategories = await this.getAllSubcategories(subcategory._id);
      allSubcategories.push(...childSubcategories);
    }

    return getInfoData({ collection: "categories", data: allSubcategories });
  }

  // Hàm lấy dữ liệu breadcrumbs
  static getBreadcrumbs = async (categoryId) => {
    const category = await this.getCategoryById(categoryId);

    // Get bread crumb
    let breadCrumbs = [category];
    let parent_id = category.parent_category_id;

    while (parent_id !== null) {
      // get parent category
      const parent_category = await this.getCategoryById(parent_id);
      breadCrumbs.unshift(parent_category);
      parent_id = parent_category.parent_category_id;
    }

    return breadCrumbs;
  }
}

module.exports = CategoryService;
