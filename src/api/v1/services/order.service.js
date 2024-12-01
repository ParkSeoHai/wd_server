"use strict"

const OrderModel = require('../models/order.model');
const { BadRequestError } = require("../core/error.response");
const { getInfoData } = require('../utils');
const UserService = require("./user.service");
const ProductService = require("./product.service");
const ProductOptionService = require("./product_option.service");
const FlashSaleService = require("./flash_sale.service");
const CartService = require("./cart.service");

class OrderService {
    static getOrder = async (userId, status) => {
        // Kiểm tra người dùng
        const foundUser = await UserService.findById(userId);
        let query = {
            user_id: foundUser._id
        };
        if (status) {
            query = {
                user_id: foundUser._id,
                status
            }
        }
        // get order
        const orders = await OrderModel.find(query).sort({ createdAt: -1 }).lean();
        // get total amount order
        orders.forEach(order => {
            let total_amount = 0;
            order.order_items.forEach(item => {
                total_amount += item.quantity * item.product_price_sale;
            });
            order.total_amount = total_amount;
        })
        return getInfoData({ collection: "orders", data: orders });
    }

    static addOrder = async ({ userId, orderItems = [], orderNote, 
        paymentMethod, addressShipping, priceShipping 
    }) => {
        // Kiểm tra người dùng
        const foundUser = await UserService.findById(userId);

        // add order
        const newOrder = await OrderModel.create({
            user_id: foundUser._id,
            order_items: orderItems,
            payment_method: paymentMethod,
            note: orderNote,
            shipping_address: addressShipping,
            price_shipping: priceShipping
        });

        // Xử lý song song các sản phẩm
        const updateTasks = orderItems.map(async (orderItem) => {
            // Giảm số lượng sản phẩm
            await ProductService.updateProductQuantity(orderItem.product_id, -orderItem.quantity);
            // Cập nhật số lượng tùy chọn sản phẩm (nếu có)
            if (orderItem.option) {
                await this.updateProductOptionQuantity(orderItem.product_id, orderItem.option, orderItem.quantity);
            }
            // Logic cập nhật flash sale
            await FlashSaleService.updateFlashSaleItemQuantity(orderItem.product_id, orderItem.quantity);
        });

        // reset cart
        const cart = await CartService.getCartByUserId(foundUser._id);
        if (cart) {
            cart.cart_items = [];
            cart.total_price = 0;
            await cart.save();
        }

        // Chờ tất cả các tác vụ hoàn thành
        await Promise.all(updateTasks);
        return newOrder;
    }

    static updateProductOptionQuantity = async (productId, option, quantity) => {
        const foundOption = await ProductOptionService.getByProductId(productId);
        foundOption.option_values.forEach(opt => {
            if (opt._id.toString() === option.option_id.toString()) {
                opt.stock -= quantity;
    
                // Cập nhật sub-option nếu có
                if (option.sub_option && opt.sub_options) {
                    opt.sub_options.option_values.forEach(subOpt => {
                        if (subOpt._id.toString() === option.sub_option.option_id.toString()) {
                            subOpt.stock -= quantity;
                        }
                    });
                }
            }
        });
        // Cập nhật vào cơ sở dữ liệu
        await foundOption.save();
    }
}

module.exports = OrderService;
