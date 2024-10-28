"use strict"

const AddressShopModel = require('../models/address_shop.model');
const { BadRequestError } = require("../core/error.response");
const { getInfoData } = require('../utils');

class AddressShopService {
  static create = async ({ name_shop, country, city, quan_huyen, xa_phuong, detail, phone_number, uptime, url_map }) => {
    const newAddressShop = await AddressShopModel.create({
        name_shop, country, city, quan_huyen, xa_phuong, 
        detail, phone_number, uptime, url_map
    })

    if (!newAddressShop) throw new BadRequestError("Thêm địa chỉ cửa hàng mới thất bại");

    return newAddressShop;
  }

  static getAll = async () => {
    const addressShops = await AddressShopModel.find().lean();
    return {
      addressShops: getInfoData({ 
          fields: [
              "_id", "name_shop", "country", "city", "quan_huyen", 
              "xa_phuong", "detail", "phone_number", "uptime", "url_map"
          ], data: addressShops
      })
    };
  }

  static getAllByCity = async (city) => {
    // Tìm kiếm không phân biệt hoa thường
    const addressShops = await AddressShopModel.find({
        city: { $regex: city, $options: 'i' }
    }).lean();
    return {
      addressShops: getInfoData({ 
          fields: [
              "_id", "name_shop", "country", "city", "quan_huyen", 
              "xa_phuong", "detail", "phone_number", "uptime", "url_map"
          ], data: addressShops
      })
    };
  }

  static getAllByCityAndQuanHuyen = async (city, quan_huyen) => {
    // Tìm kiếm không phân biệt hoa thường
    const addressShops = await AddressShopModel.find({
        city: { $regex: city, $options: 'i' },
        quan_huyen: { $regex: quan_huyen, $options: 'i' }
    }).lean();
    return {
      addressShops: getInfoData({ 
          fields: [
              "_id", "name_shop", "country", "city", "quan_huyen", 
              "xa_phuong", "detail", "phone_number", "uptime", "url_map"
          ], data: addressShops
      })
    };
  }
}

module.exports = AddressShopService;
