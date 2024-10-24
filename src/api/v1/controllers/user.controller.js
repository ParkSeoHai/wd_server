"use strict"

const { OKResponse, CreatedResponse } = require('../core/success.response');
const UserService = require("../services/user.service");

class UserController {
  login = async (req, res, next) => {

    new OKResponse({
      message: "Đăng nhập thành công",
      metadata: await UserService.login(req.body)
    }).send(res);
  }

  register = async (req, res, next) => {

    new CreatedResponse({
      message: "Đăng ký tài khoản thành công",
      metadata: await UserService.register(req.body)
    }).send(res);
  }
}

module.exports = new UserController();