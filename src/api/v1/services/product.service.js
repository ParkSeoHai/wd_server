"use strict"

const ProductModel = require('../models/product.model');

const { BadRequestError } = require("../core/error.response");
const ProductImageService = require('./product_image.service');
const ProductDetailService = require('./product_detail.service');
const ProductOptionService = require('./product_option.service');
const { getInfoData } = require('../utils');

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
}

module.exports = ProductService;
