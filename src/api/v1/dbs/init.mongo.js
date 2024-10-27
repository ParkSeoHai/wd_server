'use strict'

// Singleton design pattern

const { default: mongoose } = require("mongoose");

const { db } = require("../../../config/config.mongodb");

const connectString = `${db.connectString}`;

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        console.log(connectString)

        if (type == 'mongodb') {
            if (1 === 1) {
                mongoose.set('debug', true);
                mongoose.set('debug', { color: true });
            }

            mongoose.connect(connectString, {
                maxPoolSize: 50
            })
                .then(_ => {
                    console.log(`Connect Mongodb Success`);
                })
                .catch(err => {
                    console.log(`Error connect ${err}`);
                })
        }
    }

    static getInstance() {
        if(!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;