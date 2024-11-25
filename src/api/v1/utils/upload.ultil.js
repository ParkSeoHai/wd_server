"use strict";

const cloudinary = require("cloudinary").v2;

const uploadFileImg = async (file, folderName) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(file, {
            folder: folderName
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