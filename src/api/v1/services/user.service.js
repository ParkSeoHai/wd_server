"use strict"

const bcrypt = require('bcrypt');

const userModel = require('../models/user.model');
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { getInfoData, uploadFileImg } = require('../utils');
const { default: mongoose } = require('mongoose');

class UserService {
  // static findByEmail = async (email) => {
  //   // check user registed
  //   const foundUser = await userModel.findOne({email}).lean();
  //   return foundUser;
  // }

  static getInfoReview = async (userId) => {
    const foundUser = await userModel.findById(userId).lean();
    if (!foundUser) throw new AuthFailureError("Không tìm thấy người dùng");
    return getInfoData({ fieldsImportant: ["name", "avatar"], data: foundUser });
  }

  static findById = async (userId) => {
    const foundUser = await userModel.findById(userId);
    if (!foundUser) throw new AuthFailureError("Không tìm thấy người dùng");
    return foundUser;
  }

  static getAccount = async (userId) => {
    const foundUser = await userModel.findById(userId).lean();
    if (!foundUser) throw new AuthFailureError("Không tìm thấy người dùng");
    return {
      user: getInfoData({ collection: "users", fieldsOption: ["address"], data: foundUser })
    };
  }

  static updateInfoAccount = async ({ _id, birthday, gender, name, phone_number }) => {
    const foundUser = await this.findById(_id);
    // update
    foundUser.birthday = birthday;
    foundUser.gender = gender;
    foundUser.name = name;
    foundUser.phone_number = phone_number;
    const result = await foundUser.save();
    if (!result) throw new BadRequestError("Cập nhật thất bại");
    return {
      user: getInfoData({ collection: "users", fieldsOption: ["address"], data: result })
    };
  }

  static addCustomerAddress = async ({ userId, addressItem }) => {
    // find user by id
    const foundUser = await this.findById(userId);
    // check if addressItem is default then change default address old
    if (addressItem.default === true) {
      foundUser.address.forEach(address => {
        address.default = false;
      });
    }
    // add item
    addressItem._id = new mongoose.Types.ObjectId();
    if (foundUser.address.length === 0) {
      addressItem.default = true;
    }
    foundUser.address.push(addressItem);
    const result = await foundUser.save();
    if (!result) throw new BadRequestError("Thêm địa chỉ thất bại");
    return getInfoData({ fieldsImportant: "address", data: result });
  }

  static updateCustomerAddress = async ({ userId, addressItem }) => {
    const foundUser = await this.findById(userId);
    // check address
    const foundAddress = foundUser.address.find((item) => item._id.toString() === addressItem._id.toString());
    if (!foundAddress) throw new BadRequestError("Cập nhật địa chỉ thất bại");
    // update address
    for(var i = 0; i < foundUser.address.length; ++i) {
      // if addressItem update default is true
      if (addressItem.default === true) {
        foundUser.address[i].default = false;
      }
      if (foundUser.address[i]._id.toString() === addressItem._id.toString()) {
        foundUser.address[i] = addressItem;
      }
    }
    const result = await foundUser.save();
    if (!result) throw new BadRequestError("Cập nhật địa chỉ thất bại");
    return getInfoData({ fieldsImportant: "address", data: result });
  }

  static removeCustomerAddress = async ({ userId, addressId }) => {
    const foundUser = await this.findById(userId);
    // check address item remove has default
    const address = foundUser.address.find((item) => item._id.toString() === addressId.toString());
    // remove address
    foundUser.address = foundUser.address.filter((address) => address._id.toString() !== addressId.toString());
    if (address.default === true && foundUser.address.length > 0) {
      foundUser.address[0].default = true;
    }
    const result = await foundUser.save();
    if (!result) throw new BadRequestError("Xóa địa chỉ thất bại");
    return getInfoData({ fieldsImportant: "address", data: result });
  }

  static getCountDocument = async ({ query = {} }) => {
    return await userModel.countDocuments(query);
  }

  static getAllCrud = async ({ columns, page = 1, size = 15, searchQuery }) => {
    let query = { is_delete: false };
    if (searchQuery?.$or?.length > 0) query = { ...query, ...searchQuery };
    
    const users = await userModel.find(query).skip((page - 1) * size).limit(size).lean();
    // get options
    let options = {
      page, size, totalSize: await this.getCountDocument({ query: { is_delete: false } })
    };

    return { users: getInfoData({ fieldsImportant: [...columns, "_id"], data: users }), options };
  }

  static addOrUpdateCrud = async ({ data, action }) => {
    // check email exist
    if (data.email && action === "add") {
      const checkUser = await userModel.findOne({ email: data.email, is_delete: false }).lean();
      if (checkUser) throw new BadRequestError("Email đã được sử dụng");
    }

    const filter = { _id: new mongoose.Types.ObjectId(data.id) };
    if (data.avatar) {
      const resUpload = await uploadFileImg(data.avatar, "wdsmart-avatar", { width: 480, height: 480 });
      data.avatar = resUpload.url;
    }
    
    const result = await userModel.findOneAndUpdate(filter, data, {
      new: true,
      upsert: true
    });
    return { id: result._id };
  }

  static getByIdCrud = async (userId) => {
    const foundUser = await userModel.findOne({ _id: userId, is_delete: false });
    if (!foundUser) throw new BadRequestError("Không tìm thấy người dùng");
    return foundUser;
  }

  static deleteByIdCrud = async ({ id }) => {
    const foundUser = await this.findById(id);
    foundUser.is_delete = true;
    return await foundUser.save();
  }
}

module.exports = UserService
