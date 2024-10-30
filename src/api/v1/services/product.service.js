"use strict"

const ProductModel = require('../models/product.model');

const { BadRequestError } = require("../core/error.response");
const ProductImageService = require('./product_image.service');
const ProductDetailService = require('./product_detail.service');
const ProductOptionService = require('./product_option.service');
const { getInfoData } = require('../utils');
const CategoryService = require('./category.service');
const { isNull } = require('lodash');

class ProductService {
  static getWithPagination = async ({ page = 1, limit = 10 }) => {
    const skipDoc = limit * (page - 1);

    const products = await ProductModel.find({ publish: true }).skip(skipDoc).limit(limit).lean();
    // Get image thumbnail
    await Promise.all(products.map(async (product) => {
      const imageThumbs = await ProductImageService.findByProductId({ productId: product._id, type: "thumbnail" });
      product.imageThumbs = imageThumbs;
    }));

    return {
      products: getInfoData({collection: "products", data: products })
    };
  }

  static getCountDocument = async ({ query = {} }) => {
    return await ProductModel.countDocuments(query);
  }

  static createProduct = async ({
    product_name, product_description, product_price, 
    product_quantity, product_discount, publish, 
    brand_name, category_id, product_type 
  }) => {
    const newProduct = await ProductModel.create({
      product_name, product_description, product_price,
      product_quantity, product_discount, publish,
      brand_name, category_id, product_type
    });

    if (!newProduct) throw new BadRequestError("Thêm sản phẩm mới thất bại");

    return newProduct;
  }

  static getById = async (id) => {
    // Get product
    const foundProduct = await ProductModel.findById(id).lean();
    if (!foundProduct) throw new BadRequestError("Sản phẩm không tồn tại");

    // Get product images
    const productImages = await ProductImageService.findByProductId({ productId: foundProduct._id });

    // Get product detail
    const productDetail = await ProductDetailService.findByProductId(foundProduct._id);

    // Get product options
    const productOptions = await ProductOptionService.findByProductId(foundProduct._id);

    return {
      product: getInfoData({ collection: "products", data: foundProduct }),
      images: productImages,
      detail: productDetail,
      options: productOptions
    };
  }

  static getProductsByCategory = async (category_url) => {
    // Get category
    const category = await CategoryService.getCategoryByUrl(category_url);

    // Get all sub categories (if exist)
    const subCategories = await CategoryService.getAllSubcategories(category._id);

    // Create a new array id category (category parent and sub category)
    let ids = [category._id];
    subCategories.forEach(sub => ids.push(sub._id));

    // Get all product from list ids category
    const products = await ProductModel.find({ category_id: { $in: ids } }).lean();

    // Get bread crumb
    let breadCrumb = [category];
    let parent_id = category.parent_category_id;

    while (parent_id !== null) {
      // get parent category
      const parent_category = await CategoryService.getCategoryById(parent_id);
      breadCrumb.unshift(parent_category);
      parent_id = parent_category.parent_category_id;
    }

    return { products, breadCrumb };
  }
}

module.exports = ProductService;
