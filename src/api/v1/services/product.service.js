"use strict"

const ProductModel = require('../models/product.model');

const { BadRequestError } = require("../core/error.response");

class ProductService {
  static getAll = async () => {
    const products = ProductModel.find().lean()
    return products
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
}

module.exports = ProductService
