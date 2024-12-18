"use strict";

const { InternalServerError } = require("../core/error.response");

const cloudinary = require("cloudinary").v2;

const uploadFileImg = async (file, folderName, options = {}) => {
    try {
        const transformation = [
            { quality: 'auto' }, // Tự động tối ưu chất lượng
            { fetch_format: 'auto' } // Tự động chọn định dạng phù hợp (webp, jpeg...)
        ];
        if (options) transformation.push(options);
        const uploadResponse = await cloudinary.uploader.upload(file, {
            folder: folderName, transformation
        }).catch((err) => {
            console.log(err);
            throw new InternalServerError("Có lỗi xảy ra");
        });
        return uploadResponse;
    } catch (err) {
        console.error(err);
        throw new InternalServerError("Có lỗi xảy ra");
    }
}

module.exports = {
    uploadFileImg
}