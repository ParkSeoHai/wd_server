"use strict"

const ProductModel = require('../models/product.model');

const { BadRequestError } = require("../core/error.response");
const { getInfoData, calcProductPriceSale, uploadFileImg } = require('../utils');

const {
  ProductImageService, ProductDetailService,
  ProductOptionService, CategoryService
} = require("./");
const { default: mongoose } = require('mongoose');

class ProductService {
  static checkProduct = async (id) => {
    let product = await ProductModel.findById(id);
    if (!product) throw new BadRequestError("Sản phẩm không tồn tại");
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
      products[index] = await this.getInfoProduct(product._id, null);
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
    if (flash_sale?.discount >= 0) {
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

  static getInfoProduct = async (productId, option) => {
    // get info data product
    const product = await this.getById(productId);
    // Get info flashsale if exist
    product.flash_sale = await this.getInfoFlashSale(product._id);
    // Get discount
    if (product.flash_sale) {
      product.product_discount = product.flash_sale.discount;
    }
    if (option) {
      const optionProduct = await ProductOptionService.findByProductId(product._id);
      let price_adjustment = 0;
      // Lặp qua các giá trị tùy chọn chính
      for (const item of optionProduct.option_values) {
        if (item._id.toString() === option.option_id.toString()) {
          price_adjustment = item.price_adjustment || 0;
          // Kiểm tra tùy chọn con
          if (option.sub_option) {
            for (const subOption of item.sub_options?.option_values || []) {
              if (subOption._id.toString() === option.sub_option.option_id.toString()) {
                price_adjustment = subOption.price_adjustment || 0;
                break;
              }
            }
          }
          break;
        }
      }
      product.product_price += price_adjustment;
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

  static updateProductQuantity = async (productId, quantityChange) => {
    await ProductModel.updateOne(
      { _id: productId },
      { $inc: { product_quantity: quantityChange } }
    );
  }

  static getAllCrud = async ({ columns, page = 1, size = 15, searchQuery }) => {
    let query = {
      publish: true,
    };
    if (searchQuery?.$or?.length > 0) query = {
      ...query,
      searchQuery
    };

    let products = await ProductModel.find(query).skip((page - 1) * size).limit(size).lean();
    await Promise.all(products.map(async (product, index) => {
      // image thumbs
      const imageThumbs = await ProductImageService.findByProductId({ productId: product._id, type: "thumbnail" });
      products[index].product_thumb = imageThumbs[0]?.image_url;
    }));
    products = getInfoData({ fieldsImportant: [...columns, "_id"], data: products });
    console.log("options");
    // get options
    let options = {
      page, size, totalSize: await this.getCountDocument({ query })
    };
    
    return { products, options };
  }

  static addOrUpdateCrud = async ({ data, action }) => {
    if (data.id) {
      await this.checkProduct(data.id);
    }
    // add or update product
    const filter = { _id: new mongoose.Types.ObjectId(data.id) };
    const dataProduct = {
      product_name: data.product_name,
      product_description: data.product_description,
      product_price: data.product_price,
      product_quantity: data.product_quantity,
      product_discount: data.product_discount,
      brand_name: data.brand_name,
      publish: data.publish,
      category_id: data.category_id,
      product_type: data.product_type,
      product_url: data.product_url
    };
    const result = await ProductModel.findOneAndUpdate(filter, dataProduct, {
      new: true,
      upsert: true
    });
    // add product thumbnail
    if (data.product_thumbnail) {
      // remove all product image old
      await ProductImageService.removeAllByProductId({ product_id: result._id, type: "thumbnail" });
      const resUpload = await uploadFileImg(data.product_thumbnail, "wdsmart-product", { width: 358, height: 358 });
      await ProductImageService.createProductImage({
        product_id: result._id, alt_text: data.product_name, order: 1, type: "thumbnail", image_url: resUpload.url
      });
    }
    // add product gallery
    if (data.product_gallery?.length > 0) {
      // remove all product image old
      await ProductImageService.removeAllByProductId({ product_id: result._id, type: "gallery" });
      for (const image of data.product_gallery) {
        const resUpload = await uploadFileImg(image, "wdsmart-product");
        await ProductImageService.createProductImage({
          product_id: result._id, alt_text: data.product_name, order: 1, type: "gallery", image_url: resUpload.url
        });
      }
    }
    // add product option
    if (data.product_options?.length > 0) {
      // remove product option old
      await ProductOptionService.removeByProductId(result._id);
      let option_name = "";
      let option_values = [];
      for (const option of data.product_options) {
        option_name = option.option_name;
        option_values.push({
          image: option.option_image,
          value: option.option_value,
          price_adjustment: Number(option.price_adjustment),
          stock: Number(option.stock)
        })
      }
      await ProductOptionService.addProductOption({ product_id: result._id, option_name, option_values });
    }
    return { id: result._id };
  }

  static getByIdCrud = async (productId) => {
    const foundProduct = await ProductModel.findOne({ _id: productId }).lean();
    if (!foundProduct) throw new BadRequestError("Không tìm thấy sản phẩm");
    // get image thumnail
    const thumbnails = await ProductImageService.findByProductId({ productId: foundProduct._id, type: "thumbnail" });
    foundProduct.product_thumbnail = thumbnails[0]?.image_url;
    // get image gallery
    foundProduct.product_gallery = [];
    const galleries = await ProductImageService.findByProductId({ productId: foundProduct._id, type: "gallery" });
    for (const gallery of galleries) {
      foundProduct.product_gallery.push(gallery.image_url);
    }
    // get product option
    foundProduct.product_options = [];
    const option = await ProductOptionService.findByProductId(foundProduct._id);
    for (const optionItem of option.option_values) {
      foundProduct.product_options.push({
        option_image: optionItem.image,
        option_name: option.option_name,
        option_value: optionItem.value,
        price_adjustment: optionItem.price_adjustment,
        stock: optionItem.stock
      });
    }
    return foundProduct;
  }

  static deleteByIdCrud = async ({ id }) => {
    const foundProduct = await this.checkProduct(id);
    foundProduct.publish = false;
    return await foundProduct.save();
  }
}

module.exports = ProductService;
