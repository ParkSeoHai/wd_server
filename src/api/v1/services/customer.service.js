"use strict"

const bcrypt = require('bcrypt');

const userModel = require('../models/user.model');
const favoriteModel = require('../models/product_favorite.model');
const { BadRequestError } = require("../core/error.response");
const { getInfoData } = require('../utils');
const UserService = require('./user.service');
const { isValidObjectId } = require('mongoose');

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

  static getFavoriteWithPagination = async ({page, limit, userId}) => {
    // check user
    const foundUser = await UserService.findById(userId);
    // get fâvorite
    const foundFavorite = await favoriteModel.findOne({ user_id: foundUser._id }).lean();
    if (!foundFavorite) throw new BadRequestError("Không tìm thấy dữ liệu yêu thích của người dùng");
    // slice favorite items
    const startIndex = (page - 1) * limit;
    foundFavorite.favorite_items = foundFavorite.favorite_items.slice(startIndex, page * limit);
    // get info product item
    const ProductService = require("./product.service");
    await Promise.all(foundFavorite.favorite_items.map(async (item, index) => {
      foundFavorite.favorite_items[index] = await ProductService.getInfoProduct(item.product_id);
    }));
    return {
      favorite: getInfoData({ collection: "product_favorites", data: foundFavorite }),
      options: { page, limit, totalSize: foundFavorite.favorite_items.length }
    };
  }

  static createFavorite = async (userId) => {
    const favorite = await favoriteModel.create({
      user_id: userId,
      favorite_items: []
    });
    if (!favorite) throw new BadRequestError("Thêm sản phẩm yêu thích thất bại");
    return favorite;
  }

  // check product in favorite item
  static checkFavoriteItem = async ({ userId, productId }) => {
    if (!isValidObjectId(userId)) return false;
    // check document favorite exist
    const foundFavorite = await favoriteModel.findOne({ user_id: userId });
    if (!foundFavorite) return false;
    // check item in favorite_items
    const favoriteItem = foundFavorite.favorite_items.find((item) => item.product_id.toString() === productId.toString());
    if (!favoriteItem) return false;
    return true;
  }

  static addFavorite = async ({ userId, productId }) => {
    // check user
    const foundUser = await UserService.findById(userId);
    // check product
    const ProductService = require('./product.service');
    const foundProduct = await ProductService.checkProduct(productId);
    // check document favorite exist
    let foundFavorite = await favoriteModel.findOne({ user_id: foundUser._id });
    // if not then create new
    if (!foundFavorite) {
      foundFavorite = await this.createFavorite(foundUser._id);
    }
    // check item in favorite_items
    const favoriteItem = foundFavorite.favorite_items.find((item) => item.product_id.toString() === foundProduct._id.toString());
    if (favoriteItem) throw new BadRequestError("Sản phẩm đã có trong yêu thích của bạn");
    // add item
    foundFavorite.favorite_items.push({
      product_id: foundProduct._id
    });
    // save favorite
    const result = await foundFavorite.save();
    if (!result) throw new BadRequestError("Thêm sản phẩm yêu thích thất bại");
    return result;
  }

  static removeFavoriteItem = async ({ userId, productId }) => {
    // check user
    const foundUser = await UserService.findById(userId);
    // get fâvorite
    const foundFavorite = await favoriteModel.findOne({ user_id: foundUser._id });
    if (!foundFavorite) throw new BadRequestError("Không tìm thấy dữ liệu yêu thích của người dùng");
    // remove item
    foundFavorite.favorite_items = foundFavorite.favorite_items.filter(item => item.product_id.toString() !== productId);
    // save
    const result = await foundFavorite.save();
    if (!result) throw new BadRequestError("Xóa sản phẩm yêu thích thất bại");
    return result;
  }
}

module.exports = CustomerService;
