const _ = require("lodash");
const { convertStringToTimestamp, formatIsoDateToDateTime } = require("./date.util");
const { uploadFileImg } = require("./upload.ultil");

const getInfoData = ({ collection = null, fieldsImportant = [], fieldsOption = [], data }) => {
    let fields = [];
    
    if (fieldsImportant.length > 0) {
        fields = fieldsImportant
    } else if (collection === "products") {
        fields = [
            "_id", "product_name", "product_url", "product_price", "product_quantity",
            "product_discount", "product_type", "imageThumbs"
        ];
    } else if (collection === "categories") {
        fields = ["_id", "category_name", "category_url", "icon", "category_description", "parent_category_id", "order"];
    } else if (collection === "product_images") {
        fields = ["image_url", "type", "alt_text", "order"];
    } else if (collection === "product_details") {
        fields = ["_id", "attributes"];
    } else if (collection === "product_options") {
        fields = ["_id", "option_name", "option_values"];
    } else if (collection === "address_shop") {
        fields = [
            "_id", "name_shop", "country", "city", "quan_huyen", 
            "xa_phuong", "detail", "phone_number", "uptime", "url_map"
        ];
    } else if (collection === "flash_sales") {
        fields = ["_id", "start_time", "end_time", "flash_sale_items", "publish"];
    } else if (collection === "users") {
        fields = ["_id", "email", "name", "phone_number", "gender", "birthday", "avatar"];
    } else if (collection === "carts") {
        fields = ["_id", "cart_items", "total_price"];
    } else if (collection === "product_favorites") {
        fields = ["_id", "favorite_items"];
    } else if (collection === "reviews") {
        fields = ["_id", "rating", "review_text", "createdAt"];
    } else if (collection === "rating_summary") {
        fields = ["_id", "total_reviews", "average_rating", "ratings_by_stars"];
    }

    const newFields = fields.concat(fieldsOption);

    if (_.isArray(data)) {
        let result = [];
        data.forEach(item => {
            result.push(_.pick(item, newFields));
        })
        return result;
    }

    return _.pick(data, newFields)
}

const calcProductPriceSale = ({ price, discount }) => {
    const priceSale = (price * discount) / 100;
    return price - priceSale;
}

module.exports = {
    getInfoData,
    convertStringToTimestamp,
    calcProductPriceSale,
    uploadFileImg,
    formatIsoDateToDateTime
}