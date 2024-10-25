"use strict"

const ProductModel = require('../models/product.model');

const { BadRequestError } = require("../core/error.response");
const { isValidObjectId } = require('mongoose');
const ProductImageService = require('./product_image.service');
const ProductDetailService = require('./product_detail.service');
const ProductOptionService = require('./product_option.service');
const { getInfoData } = require('../utils');

class ProductService {
  static getAll = async () => {
    const products = await ProductModel.find({
      publish: true
    }).lean();
    // Get image thumbnail
    await Promise.all(products.map(async (product) => {
      const imageThumbs = await ProductImageService.findByProductId({ productId: product._id, type: "thumbnail" });
      product.imageThumbs = imageThumbs;
    }));

    return getInfoData({ 
      fields: ["_id", "product_name", "product_description", "product_price", 
        "product_quantity", "product_discount", "brand_name", "product_type", "imageThumbs"
      ], data: products
    });
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
    if (!isValidObjectId(id)) throw new BadRequestError("Id sản phẩm không hợp lệ");

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
      product: foundProduct,
      images: productImages,
      detail: productDetail,
      options: productOptions
    };
  }
}

module.exports = ProductService;
