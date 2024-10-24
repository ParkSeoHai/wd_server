"use strict"

const bcrypt = require('bcrypt');

const userModel = require('../models/user.model');
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { getInfoData } = require('../utils');

class UserService {
  static login = async ({email, password, role = "customer"}) => {
    // find user
    const foundUser = await userModel.findOne({email}).lean();
    if (!foundUser) throw new AuthFailureError("Email hoặc mật khẩu không chính xác");

    // check match password
    const matchPassword = await bcrypt.compare(password, foundUser.password);
    if (!matchPassword) throw new AuthFailureError("Email hoặc mật khẩu không chính xác");

    // check role admin
    if (role === "admin") {
      if (foundUser.role !== role) throw new AuthFailureError("Bạn không có quyền truy cập");
    }

    return {
      user: getInfoData({fields: ["_id", "email", "name", "role"], object: foundUser})
    }
  }

  static register = async ({name, email, phone_number, password}) => {
    // check user registed
    const foundUser = await this.findByEmail(email);
    if (foundUser) throw new BadRequestError("Email đã được đăng ký!");

    // hash password
    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = await userModel.create({
      name, email, phone_number, password: passwordHash
    })
    if (!newUser) throw new BadRequestError("Đăng ký tài khoản thất bại");

    return {
      user: getInfoData({fields: ["_id", "email", "name", "role"], object: newUser})
    }
  }

  static findByEmail = async (email) => {
    // check user registed
    const foundUser = await userModel.findOne({email}).lean();
    return foundUser;
  }
}

module.exports = UserService
