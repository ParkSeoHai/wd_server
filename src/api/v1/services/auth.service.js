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

  static getOTP = async ({emailTo, name}) => {
    const randomOtp = Math.floor(100000 + Math.random() * 900000);
    await this.sendOTPMail({ emailTo, name, otpCode: randomOtp });
    return randomOtp;
  }

  static sendOTPMail = async ({ subject = 'WD Smart', emailTo, name, otpCode }) => {
    var transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.AUTH_MAIL_USER,
        pass: process.env.AUTH_MAIL_PASS
      }
    });

    transport.verify((error, success) => {
      if (error) {
        console.error("Mail server connection failed:", error);
      } else {
        console.log("Mail server is ready to send messages");
      }
    });
    
    var mailOptions = {
      from: process.env.AUTH_MAIL_USER,
      to: emailTo,
      subject,
      html: `<!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mã OTP của bạn</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #4CAF50;
                    padding: 15px;
                    text-align: center;
                    color: #ffffff;
                    font-size: 20px;
                    border-radius: 5px 5px 0 0;
                }
                .content {
                    padding: 20px;
                    color: #333333;
                    line-height: 1.6;
                    text-align: center;
                }
                .otp-code {
                    font-size: 24px;
                    color: #4CAF50;
                    font-weight: bold;
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #777777;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    Xác minh tài khoản của bạn
                </div>
                <div class="content">
                    <p>Chào ${name},</p>
                    <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi! Để xác thực tài khoản, vui lòng nhập mã OTP dưới đây:</p>
                    <div class="otp-code">${otpCode}</div>
                    <p>Mã OTP này sẽ hết hạn sau 5 phút. Vui lòng không chia sẻ mã này với bất kỳ ai để bảo mật tài khoản của bạn.</p>
                </div>
                <div class="footer">
                    <p>Email hỗ trợ: 20210864@eaut.edu.vn</p>
                    <p>Điện thoại: 0342404775</p>
                </div>
            </div>
        </body>
      </html>`
    };

    let info = await transport.sendMail(mailOptions);
    if (!info.response) throw AuthFailureError("Send Mail Failure");
  }
}

module.exports = AuthService;
