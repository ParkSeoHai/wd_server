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
    return getInfoData({ collection: "address_shop", data: addressShops });
  }

  static getAllByCity = async (city) => {
    // Tìm kiếm không phân biệt hoa thường
    const addressShops = await AddressShopModel.find({
        city: { $regex: city, $options: 'i' }
    }).lean();
    return getInfoData({ collection: "address_shop", data: addressShops });
  }

  static getAllByCityAndQuanHuyen = async (city, quan_huyen) => {
    // Tìm kiếm không phân biệt hoa thường
    const addressShops = await AddressShopModel.find({
        city: { $regex: city, $options: 'i' },
        quan_huyen: { $regex: quan_huyen, $options: 'i' }
    }).lean();
    return getInfoData({ collection: "address_shop", data: addressShops });
  }

  static getCitiesAndQuanHuyen = async () => {
    /**
     * city: [
     *  {
     *    name: "HaNoi",
     *    quan_huyen: [
     *      name: "Cầu Giay"
     *    ]
     *  }
     * ]
     */
    const cities = [];

    // Get all address
    const addressShops = await AddressShopModel.find().lean();
    
    addressShops.forEach(address => {
      let exist = false;
      cities.forEach(city => {
        // if city exist -> push quan_huyen to array of city
        if (city.name.includes(address.city)) {
          exist = true;
          city.quan_huyen.push(address.quan_huyen);
        }
      });

      if (!exist) {
        cities.push({ name: address.city, quan_huyen: [address.quan_huyen] })
      }
    });

    return cities;
  }
}

module.exports = AddressShopService;
