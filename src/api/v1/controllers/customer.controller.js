"use strict"

const { OKResponse, CreatedResponse } = require('../core/success.response');
const CustomerService = require("../services/customer.service");

class UserController {

  createCustomer = async (req, res, next) => {

    new CreatedResponse({
      message: "Thêm khách hàng mới thành công",
      metadata: await CustomerService.createCustomer(req.body)
    }).send(res);
  }
}

module.exports = new UserController();