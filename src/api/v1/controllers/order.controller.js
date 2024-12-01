"use strict"

const { OKResponse, CreatedResponse } = require('../core/success.response');
const OrderService = require('../services/order.service');

class OrderController {
    getOrder = async (req, res, next) => {
        const userId = req.params.userId;
        const status = req.query.status;

        new OKResponse({
            message: "Lấy dữ liệu đơn hàng thành công",
            metadata: await OrderService.getOrder(userId, status)
        }).send(res);
    }

    addOrder = async (req, res, next) => {
        new CreatedResponse({
            message: "Đặt hàng thành công",
            metadata: await OrderService.addOrder(req.body)
        }).send(res);
    }
}

module.exports = new OrderController();