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

  getAccount = async (req, res, next) => {
    const userId = req.params.userId;

    new OKResponse({
      message: "Lấy thông tin thành công",
      metadata: await UserService.getAccount(userId)
    }).send(res);
  }

  updateInfoAccount = async (req, res, next) => {
    new OKResponse({
      message: "Cập nhật thông tin thành công",
      metadata: await UserService.updateInfoAccount(req.body)
    }).send(res);
  }

  addCustomerAddress = async (req, res, next) => {
    new OKResponse({
      message: "Thêm địa chỉ mới thành công",
      metadata: await UserService.addCustomerAddress(req.body)
    }).send(res);
  }

  updateCustomerAddress = async (req, res, next) => {
    new OKResponse({
      message: "Cập nhật địa chỉ thành công",
      metadata: await UserService.updateCustomerAddress(req.body)
    }).send(res);
  }

  removeCustomerAddress = async (req, res, next) => {
    new OKResponse({
      message: "Xóa địa chỉ thành công",
      metadata: await UserService.removeCustomerAddress(req.body)
    }).send(res);
  }

  getAllCrud = async (req, res, next) => {
    const { users, options } = await UserService.getAllCrud(req.body);

    new OKResponse({
      message: "Lấy dữ liệu người dùng thành công",
      metadata: { data: users },
      options
    }).send(res);
  }

  addOrUpdateCrud = async (req, res, next) => {
    new CreatedResponse({
      message: "Thành công",
      metadata: await UserService.addOrUpdateCrud(req.body)
    }).send(res);
  }

  getByIdCrud = async (req, res, next) => {
    const userId = req.params.userId;

    new OKResponse({
      message: "Lấy dữ liệu người dùng thành công",
      metadata: await UserService.getByIdCrud(userId)
    }).send(res);
  }
}

module.exports = new UserController();