const _ = require("lodash")

const getInfoData = ({ collection = null, fieldsImportant = [], fieldsOption = [], data }) => {
    let fields = [];
    
    if (fieldsImportant.length > 0) {
        fields = fieldsImportant
    } else if (collection === "products") {
        fields = [
            "_id", "product_name", "product_url", "product_description", "product_price",
            "product_quantity", "product_discount", "brand_name", "product_type", "imageThumbs"
        ];
    } else if (collection === "categories") {
        fields = ["_id", "category_name", "category_url", "icon", "category_description"];
    } else if (collection === "product_images") {
        fields = ["image_url", "type", "alt_text", "order"];
    } else if (collection === "product_details") {
        fields = ["_id", "attributes"];
    } else if (collection === "product_options") {
        fields = ["_id", "option_name", "option_values", "order"];
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

module.exports = {
    getInfoData
}