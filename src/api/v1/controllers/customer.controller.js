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

  getFavorite = async (req, res, next) => {
    const page = req.query.p || 1;
    const limit = req.query.limit || 10;
    const userId = req.params.userId;

    const data = await CustomerService.getFavoriteWithPagination({ page, limit, userId });

    new OKResponse({
      message: "Lấy danh sách yêu thích thành công",
      metadata: data.favorite,
      options: data.options
    }).send(res);
  }

  checkFavoriteItem = async (req, res, next) => {
    return res.status(200).json(await CustomerService.checkFavoriteItem(req.body));
  }

  addFavorite = async (req, res, next) => {
    new CreatedResponse({
      message: "Đã thêm vào danh sách yêu thích",
      metadata: await CustomerService.addFavorite(req.body)
    }).send(res);
  }

  removeFavoriteItem = async (req, res, next) => {
    new OKResponse({
      message: "Đã xóa khỏi danh sách yêu thích",
      metadata: await CustomerService.removeFavoriteItem(req.body)
    }).send(res);
  }
}

module.exports = new UserController();