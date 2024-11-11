"use strict"

const { OKResponse, CreatedResponse } = require('../core/success.response');
const CartService = require('../services/cart.service');

class CartController {

    getCart = async (req, res, next) => {
        const userId = req.params.userId;

        new OKResponse({
            message: "Lấy dữ liệu giỏ hàng thành công",
            metadata: await CartService.getCart(userId)
        }).send(res);
    }

    addItem = async (req, res, next) => {
        new CreatedResponse({
            message: "Thêm sản phẩm vào giỏ hàng thành công",
            metadata: await CartService.addItem(req.body)
        }).send(res);
    }

    removeItem = async (req, res, next) => {
        new OKResponse({
            message: "Xóa sản phẩm giỏ hàng thành công",
            metadata: await CartService.removeItem(req.body)
        }).send(res);
    }

    updateQuantityItem = async (req, res, next) => {
        new OKResponse({
            message: "Cập nhật số lượng sản phẩm giỏ hàng thành công",
            metadata: await CartService.updateQuantityItem(req.body)
        }).send(res);
    }
}

module.exports = new CartController();