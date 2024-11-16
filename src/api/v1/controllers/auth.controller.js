"use strict"

const { OKResponse, CreatedResponse } = require('../core/success.response');
const AuthService = require('../services/auth.service');

class AuthController {
  login = async (req, res, next) => {
    new OKResponse({
      message: "Đăng nhập thành công",
      metadata: await AuthService.login(req.body)
    }).send(res);
  }

  register = async (req, res, next) => {
    new CreatedResponse({
      message: "Đăng ký tài khoản thành công",
      metadata: await AuthService.register(req.body)
    }).send(res);
  }

  getOTP = async (req, res, next) => {
    const otp = await AuthService.getOTP(req.body);
    return res.status(200).json(otp);
  }
}

module.exports = new AuthController();