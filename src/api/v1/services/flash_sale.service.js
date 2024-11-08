"use strict"

const FlashSaleModel = require('../models/flash_sale.model');
const { BadRequestError } = require("../core/error.response");
const { getInfoData, convertStringToTimestamp } = require('../utils');
const ProductService = require('./product.service');

class FlashSaleService {
  static createFlashSale = async ({ start_time, end_time, flash_sale_items, publish }) => {
    // kiem tra xem co flash sale nao dang dien ra hay ko
    const checkFlashSale = await FlashSaleModel.findOne({ publish: true }).lean();
    if (checkFlashSale) throw new BadRequestError("Tạo mới flash sale không thành công, hệ thống đã có flash sale đang diễn ra");

    // convert start_time, end_time from date string to timestamp
    const start_timestamp = convertStringToTimestamp(start_time);
    const end_timestamp = convertStringToTimestamp(end_time);
    console.log(start_timestamp, end_timestamp);

    const newFlashSale = await FlashSaleModel.create({
      start_time: start_timestamp, end_time: end_timestamp, flash_sale_items, publish
    });

    if (!newFlashSale) throw new BadRequestError("Tạo mới flash sale không thành công");

    return newFlashSale;
  }

  static getFlashSale = async ({ page = 1, limit = 15 }) => {
    const skipItem = limit * (page - 1);
    let message = "Lấy dữ liệu flash sale thành công";

    // get current time
    const currentTime = Math.floor(new Date().getTime() / 1000);

    // get flash sale with publish = true, get limit flash sale items
    let flashSale = await FlashSaleModel.aggregate([
      { $match: { publish: true, end_time: { $gt: currentTime } } },
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
    await Promise.all(flashSale.flash_sale_items.map(async (flashItem, index) => {
      const product = await ProductService.getById(flashItem.product_id);
      flashSale.flash_sale_items[index] = {
        ...product,
        ...getInfoData({ data: flashItem, fieldsImportant: ["discount", "quantity_sale", "quantity_sold"]})
      };
    }));

    return {
      flashSale: getInfoData({ collection: "flash_sale", data: flashSale }),
      message,
      options: { page, limit }
    };
  }
}

module.exports = FlashSaleService;
