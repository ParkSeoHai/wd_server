"use strict"

const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

const userModel = require('../models/user.model');
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { getInfoData } = require('../utils');

class AuthService {
  static login = async ({email, password, role = "customer"}) => {
    // find user
    const foundUser = await userModel.findOne({email}).lean();
    if (!foundUser) throw new AuthFailureError("Email hoặc mật khẩu không chính xác");

    // check match password
    const matchPassword = await bcrypt.compare(password, foundUser.password);
    if (!matchPassword) throw new AuthFailureError("Email hoặc mật khẩu không chính xác");

    // check role admin
    if (role === "admin") {
      if (foundUser.role !== role) throw new AuthFailureError("Bạn không có quyền truy cập");
    }

    return {
      user: getInfoData({collection: "users", data: foundUser})
    }
  }

  static register = async ({name, email, phone_number, password}) => {
    // check user registed
    const foundUser = await userModel.findOne({email}).lean();
    if (foundUser) throw new BadRequestError("Email đã được đăng ký!");

    // hash password
    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = await userModel.create({
      name, email, phone_number, password: passwordHash
    })
    if (!newUser) throw new BadRequestError("Đăng ký tài khoản thất bại");

    return {
      user: getInfoData({collection: "users", fieldsOption: ["role"], data: newUser})
    }
  }

  static getOTP = async ({emailTo}) => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000);
    await this.sendMail({ emailTo, text: `CODE: ${randomOtp}` });
    return randomOtp;
  }

  static sendMail = async ({ subject = 'WD Smart', emailTo, text }) => {
    var transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.AUTH_MAIL_USER,
        pass: process.env.AUTH_MAIL_PASS
      }
    });
    
    var mailOptions = {
      from: process.env.AUTH_MAIL_USER,
      to: emailTo,
      subject, text
    };

    let info = await transport.sendMail(mailOptions);
    if (!info.response) throw AuthFailureError("Send Mail Failure");
  }
}

module.exports = AuthService;
