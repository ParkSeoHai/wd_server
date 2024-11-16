"use strict"

const FlashSaleModel = require('../models/flash_sale.model');
const { BadRequestError } = require("../core/error.response");
const { getInfoData, convertStringToTimestamp, calcProductPriceSale } = require('../utils');
const { default: mongoose } = require('mongoose');

class FlashSaleService {
  static createFlashSale = async ({ start_time, end_time, flash_sale_items, status }) => {
    // kiem tra xem co flash sale nao dang dien ra hay ko
    // const checkFlashSale = await FlashSaleModel.findOne({ publish: true }).lean();
    // if (checkFlashSale) throw new BadRequestError("Tạo mới flash sale không thành công, hệ thống đã có flash sale đang diễn ra");

    // convert start_time, end_time from date string to timestamp
    const start_timestamp = convertStringToTimestamp(start_time);
    const end_timestamp = convertStringToTimestamp(end_time);

    const newFlashSale = await FlashSaleModel.create({
      start_time: start_timestamp, end_time: end_timestamp, flash_sale_items, status
    });

    if (!newFlashSale) throw new BadRequestError("Tạo mới flash sale không thành công");

    return newFlashSale;
  }

  static getFlashSaleDetail = async ({ page = 1, limit = 15 }) => {
    const skipItem = limit * (page - 1);
    let message = "Lấy dữ liệu flash sale thành công";

    // get current time
    const currentTime = Math.floor(new Date().getTime() / 1000);

    // get flash sale with publish, get limit flash sale items
    let flashSale = await FlashSaleModel.aggregate([
      { $match: { "status.status_code": "02", end_time: { $gt: currentTime } } },
      { $project: {
          flash_sale_items: { $slice: ["$flash_sale_items", skipItem, limit] },
          start_time: 1,
          end_time: 1
      } }
    ]);

    if (!flashSale || flashSale.length === 0) {
      return {
        message: "Không có flash sale nào đang diễn ra",
        flashSale: []
      };
    }

    // set flashSale = item first, query aggregate return array
    flashSale = flashSale[0];

    // get products flash sale
    const ProductService = require("./product.service");
    await Promise.all(flashSale.flash_sale_items.map(async (flashItem, index) => {
      const product = await ProductService.getById(flashItem.product_id);
      product.product_discount = flashItem.discount;
      // Price sale
      product.product_price_sale = calcProductPriceSale({ price: product.product_price, discount: product.product_discount });
      flashSale.flash_sale_items[index] = {
        ...product,
        flash_sale: getInfoData({ data: flashItem, fieldsImportant: ["quantity_sale", "quantity_sold", "product_price_sale"]})
      };
    }));

    return {
      flashSale: getInfoData({ collection: "flash_sales", data: flashSale }),
      message,
      options: { page, limit }
    };
  }

  static getFlashSaleItem = async (productId) => {
    // get current time
    const currentTime = Math.floor(new Date().getTime() / 1000);
    const flashSale = await FlashSaleModel.aggregate([
      {
        $match: { 
          "status.status_code": "02", 
          end_time: { $gt: currentTime } 
        }
      },
      {
        $project: {
          // Sử dụng $filter để chỉ lấy flash_sale_items có product_id khớp với productId
          flash_sale_items: {
            $filter: {
              input: "$flash_sale_items",
              as: "item",
              cond: { $eq: ["$$item.product_id", new mongoose.Types.ObjectId(productId)] }
            }
          }
        }
      }
    ]);
    
    return flashSale[0] || null;
  }
}

module.exports = FlashSaleService;
