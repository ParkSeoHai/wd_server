"use strict"

const ProductModel = require('../models/product.model');

const { BadRequestError } = require("../core/error.response");
const { getInfoData, calcProductPriceSale } = require('../utils');

const {
  ProductImageService, ProductDetailService,
  ProductOptionService, CategoryService
} = require("./");

class ProductService {
  static checkProduct = async (id) => {
    let product = await ProductModel.findById(id).lean();
    if (!product) throw new BadRequestError("Sản phẩm không được tìm thấy");
    return product;
  }

  static getAll = async ({ searchStr, page, limit, sort }) => {
    let query = {
      publish: true
    };
    // search product
    if (searchStr) {
      query = {
        ...query,
        product_name: { $regex: searchStr, $options: 'i' }
      };
    }
    // get product
    const { products, options } = await this.getWithPagination({ page, limit, query });
    // if option sort
    if (sort === "desc") products.sort((productA, productB) => productB.product_price_sale - productA.product_price_sale);
    else if (sort ==="asc") products.sort((productA, productB) => productA.product_price_sale - productB.product_price_sale);
    return { products, options };
  }

  static getWithPagination = async ({ page = 1, limit = 10, query, sort = {} }) => {
    const skipDoc = limit * (page - 1);

    const products = await ProductModel.find(query).sort(sort).skip(skipDoc).limit(limit).lean();
    // Get info product
    await Promise.all(products.map(async (product, index) => {
      products[index] = await this.getInfoProduct(product._id);
    }));
    return {
      products,
      options: { page, limit, totalSize: await this.getCountDocument({ query }) }
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

  // Get product detail by url
  static getDetail = async (productUrl) => {
    // Get product
    const foundProduct = await ProductModel
      .findOne({ product_url: productUrl, publish: true }).lean();
    if (!foundProduct) throw new BadRequestError("Sản phẩm không tồn tại");

    // Get product images
    const images = await ProductImageService.findByProductId({ productId: foundProduct._id });

    // Get product detail
    const { attributes } = await ProductDetailService.findByProductId(foundProduct._id);

    // Get product options
    const options = await ProductOptionService.findByProductId(foundProduct._id);

    // Get bread crumb
    const breadCrumbs = await CategoryService.getBreadcrumbs(foundProduct.category_id);
    
    // Get info flashsale if exist
    const flash_sale = await this.getInfoFlashSale(foundProduct._id);

    // Get discount
    if (flash_sale.discount >= 0) {
      foundProduct.product_discount = flash_sale.discount;
    }

    return {
      product: {
        ...getInfoData({ collection: "products", fieldsOption: ["brand_name", "product_description"], data: foundProduct }),
        images, attributes, options, flash_sale
      },
      breadCrumbs
    };
  }

  static getById = async (id) => {
    let product = await ProductModel.findById(id).lean();
    if (!product) throw new BadRequestError("Sản phẩm không được tìm thấy");

    // get info data
    product = getInfoData({ collection: "products", data: product });
    // image thumbs
    const imageThumbs = await ProductImageService.findByProductId({ productId: product._id, type: "thumbnail" });
    product.imageThumbs = imageThumbs;

    return product;
  }

  static getInfoProduct = async (productId) => {
    // get info data product
    const product = await this.getById(productId);
    // Get info flashsale if exist
    product.flash_sale = await this.getInfoFlashSale(product._id);
    // Get discount
    if (product.flash_sale) {
      product.product_discount = product.flash_sale.discount;
    }
    // Price sale
    product.product_price_sale = calcProductPriceSale({ 
      price: product.product_price, discount: product.product_discount });
    return product;
  }

  static getProductsByCategory = async ({ page, limit, sort, category_url }) => {
    // Get category
    const category = await CategoryService.getCategoryByUrl(category_url);

    // Get all sub categories (if exist)
    const subCategories = await CategoryService.getAllSubcategories(category._id);

    // Create a new array id category (category parent and sub category)
    // let ids = [category._id];
    // subCategories.forEach(sub => ids.push(sub._id));
    const ids = [category._id, ...subCategories.map(sub => sub._id)];

    // Get all product from list ids category
    const query = {
      category_id: { $in: ids },
      publish: true
    }
    const { products, options } = await this.getWithPagination({ page, limit, query });
    // if option sort
    if (sort === "desc") products.sort((productA, productB) => productB.product_price_sale - productA.product_price_sale);
    if (sort ==="asc") products.sort((productA, productB) => productA.product_price_sale - productB.product_price_sale);
    // Get bread crumb
    let breadCrumbs = await CategoryService.getBreadcrumbs(category._id);

    return { products, options, breadCrumbs };
  }

  static getProductsNew = async ({ page, limit }) => {
    const query = { publish: true };
    const sort = { createdAt: -1 };
    const { products, options } = await this.getWithPagination({ page, limit, query, sort });
    return { products, options };
  }

  static getInfoFlashSale = async (productId) => {
    let info = null;
    // get flash sale info product
    const FlashSaleService = require("./flash_sale.service");
    const flashSale = await FlashSaleService.getFlashSaleItem(productId);
    if (flashSale) {
      if (flashSale.flash_sale_items && flashSale.flash_sale_items.length > 0) {
        const { discount, quantity_sale, quantity_sold } = flashSale.flash_sale_items[0];
        info = { discount, quantity_sale, quantity_sold };
      }
    }
    return info;
  }
}

module.exports = ProductService;
