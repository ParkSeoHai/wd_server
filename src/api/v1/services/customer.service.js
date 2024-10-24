"use strict"

const bcrypt = require('bcrypt');

const userModel = require('../models/user.model');
const { BadRequestError } = require("../core/error.response");
const { getInfoData } = require('../utils');
const UserService = require('./user.service');

class CustomerService {
  static createCustomer = async ({email, phone_number, password, name, address }) => {
    // check user registed
    const foundCustomer = await UserService.findByEmail(email);
    if (foundCustomer) throw new BadRequestError("Email đã được sử dụng!");

    const passwordHash = await bcrypt.hash(password, 10);

    const newCustomer = await userModel.create({
      email, phone_number, password: passwordHash, name, address
    })

    if (!newCustomer) throw new BadRequestError("Thêm mới khách hàng thất bại");

    return newCustomer;
  }
}

module.exports = CustomerService;
