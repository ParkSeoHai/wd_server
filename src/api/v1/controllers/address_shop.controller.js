"use strict"

const { OKResponse, CreatedResponse } = require('../core/success.response');
const AddressShopService = require("../services/address_shop.service");

class AddressShopController {

  create = async (req, res, next) => {
    return new CreatedResponse({
      message: "Thêm địa chỉ cửa hàng mới thành công",
      metadata: await AddressShopService.create(req.body)
    }).send(res);
  }

  getAddressShops = async (req, res, next) => {
    const city = req.query.city;
    const quan_huyen = req.query.quan_huyen;
    if (city) {
        if (quan_huyen) {
            return new OKResponse({
                message: "Lấy danh sách địa chỉ cửa hàng theo thành phố và quận huyện thành công",
                metadata: await AddressShopService.getAllByCityAndQuanHuyen(city, quan_huyen)
            }).send(res);
        }

        return new OKResponse({
            message: "Lấy danh sách địa chỉ cửa hàng theo thành phố thành công",
            metadata: await AddressShopService.getAllByCity(city)
        }).send(res);
    }

    return new OKResponse({
        message: "Lấy danh sách địa chỉ cửa hàng thành công",
        metadata: await AddressShopService.getAll()
    }).send(res);
  }
}

module.exports = new AddressShopController();