"use strict"

const CartModel = require('../models/cart.model');
const { BadRequestError } = require("../core/error.response");
const { getInfoData } = require('../utils');
const { UserService } = require("./");
const ProductService = require("./product.service");

class CartService {
    static getCart = async (userId) => {
        // check user
        const user = await UserService.findById(userId);
        // get cart
        const foundCart = await CartModel.findOne({ user_id: user._id }).lean();
        if (!foundCart) return { cart_items: [] };
        let total_quantity = 0, total_price = 0;
        await Promise.all(foundCart.cart_items.map(async (item, index) => {
            const product = await ProductService.getInfoProduct(item.product_id, item.option);
            const infoDataProduct = getInfoData({ collection: "cart_item", data: product });
            foundCart.cart_items[index] = { ...infoDataProduct, ...item };
            foundCart.cart_items[index].product_thumb = product.imageThumbs[0]?.image_url;
            total_quantity += item.quantity;
            total_price += product.product_price_sale * item.quantity;
        }));
        // get total quantity cart
        foundCart.total_quantity = total_quantity;
        // get total price
        foundCart.total_price = total_price;
        return getInfoData({ collection: "carts", fieldsOption: ["total_quantity"], data: foundCart });
    }

    static createCart = async (user_id, cart_items = []) => {
        const cart = await CartModel.create({ user_id, cart_items });
        if (!cart) throw new BadRequestError("Tạo mới giỏ hàng thất bại");
        return cart;
    }

    static addItem = async ({ userId, cartItem }) => {
        // check user
        const user = await UserService.findById(userId);
        // find cart if not exist then create new
        let foundCart = await CartModel.findOne({ user_id: user._id });
        if (!foundCart) {
            foundCart = await this.createCart(user._id);
        }
        // check item is exits
        const existingItemIndex = foundCart.cart_items.findIndex((item) => {
            return (
                item.product_id.toString() === cartItem.product_id &&
                item.option.option_id.toString() === cartItem.option.option_id &&
                (!cartItem.option.sub_option ||
                    (item.option.sub_option &&
                        item.option.sub_option.option_id.toString() === cartItem.option.sub_option.option_id.toString()))
            );
        });

        if (existingItemIndex !== -1) {
            // Nếu sản phẩm đã tồn tại, tăng số lượng và tính lại giá
            foundCart.cart_items[existingItemIndex].quantity += cartItem.quantity;
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
            foundCart.cart_items.push(cartItem);
        }
        // save
        const result = await foundCart.save();
        if (!result) throw new BadRequestError("Thêm sản phẩm vào giỏ hàng thất bại");
        return result;
    }

    static removeItem = async ({ cartId, cartItemId }) => {
        // get cart by id
        const foundCart = await CartModel.findById(cartId);
        if (!foundCart) throw new BadRequestError("Giỏ hàng không được tìm thấy");
        // remove item
        foundCart.cart_items = foundCart.cart_items.filter(
            (item) => item._id.toString() !== cartItemId.toString()
        );
        // save
        const result = await foundCart.save();
        if (!result) throw new BadRequestError("Xóa sản phẩm giỏ hàng thất bại");
        return result;
    }

    static updateQuantityItem = async ({ cartId, cartItemId, value }) => {
        // Tìm giỏ hàng dựa vào cartId
        const foundCart = await CartModel.findById(cartId);
        if (!foundCart) throw new BadRequestError("Giỏ hàng không được tìm thấy.");
        // Tìm sản phẩm dựa vào cartItemId
        const cartItem = foundCart.cart_items.find(
            (item) => item._id.toString() === cartItemId.toString()
        );
        if (!cartItem) throw new BadRequestError("Sản phẩm không tồn tại trong giỏ hàng.");
        // Cập nhật số lượng sản phẩm
        cartItem.quantity += value;
        if (cartItem.quantity <= 0) {
            cartItem.quantity = 1;
        }
        // save
        const result = await foundCart.save();
        if (!result) throw new BadRequestError("Cập nhật số lượng sản phẩm giỏ hàng thất bại");
        return result;
    }

    static updateTotalPrice = (cart) => {
        // Cập nhật lại tổng giá
        cart.total_price = cart.cart_items.reduce((total, item) => {
            const itemTotalPrice = item.price_at_added * item.quantity;
            return total + itemTotalPrice;
        }, 0);
    }

    static getCartByUserId = async (userId) => {
        // check user
        const user = await UserService.findById(userId);
        // get cart
        const foundCart = await CartModel.findOne({ user_id: user._id });
        return foundCart;
    }
}

module.exports = CartService;
