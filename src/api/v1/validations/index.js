"use strict"

const { isValidObjectId } = require("mongoose")
const { BadRequestError } = require("../core/error.response")

const validObjectId = (objectId) => {
    if (!isValidObjectId(objectId)) throw new BadRequestError("Id không hợp lệ");
}

module.exports = {
    validObjectId
};