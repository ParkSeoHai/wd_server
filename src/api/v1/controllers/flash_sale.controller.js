"use strict"

const { toInteger } = require('lodash');
const { OKResponse, CreatedResponse } = require('../core/success.response');
const FlashSaleService = require('../services/flash_sale.service');

class FlashSaleController {

  createFlashSale = async (req, res, next) => {

    new CreatedResponse({
      message: "Thêm flash sale mới thành công",
      metadata: await FlashSaleService.createFlashSale(req.body)
    }).send(res);
  }

  getFlashSale = async (req, res, next) => {
    const page = toInteger(req.query.p) || 1;
    const limit = toInteger(req.query.limit) || 15;

    const { flashSale, message, options } = await FlashSaleService.getFlashSale({ page, limit });
    
    new OKResponse({
        message: message,
        metadata: flashSale,
        options
    }).send(res);
  }
}

module.exports = new FlashSaleController();