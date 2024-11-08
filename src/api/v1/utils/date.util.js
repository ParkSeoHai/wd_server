"use strict"

// func convert time string to timestamp, example: "2024-10-31 10:55"
const convertStringToTimestamp = (dateStr) => {
    const timestamp = Math.floor(new Date(dateStr).getTime() / 1000);
    return timestamp;
}

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000); // Nhân với 1000 để chuyển từ giây sang mili-giây
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng trong JavaScript bắt đầu từ 0
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month} ${hours}:${minutes}`;
}

module.exports = {
    convertStringToTimestamp,
    formatTimestamp
};