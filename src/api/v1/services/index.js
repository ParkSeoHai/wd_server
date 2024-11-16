"use strict"

const AddressShopService = require('./address_shop.service');
const CategoryService = require("./category.service");
const CustomerService = require("./customer.service");
const FlashSaleService = require('./flash_sale.service');
const ProductDetailService = require("./product_detail.service");
const ProductOptionService = require("./product_option.service");
const ProductService = require("./product.service");
const UserService = require("./user.service");
const ProductImageService = require("./product_image.service");

module.exports = {
    ProductImageService,
    AddressShopService,
    CategoryService,
    CustomerService,
    FlashSaleService,
    ProductDetailService,
    ProductOptionService,
    ProductService,
    UserService
};