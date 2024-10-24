const _ = require("lodash")

const getInfoData = ({ fields = [], data }) => {
    if (_.isArray(data)) {
        let result = [];
        data.forEach(item => {
            result.push(_.pick(item, fields));
        })
        return result;
    }

    return _.pick(data, fields)
}

module.exports = {
    getInfoData
}