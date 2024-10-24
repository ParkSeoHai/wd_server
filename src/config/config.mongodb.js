
const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000
    },
    db: {
        host: process.env.DEV_DB_HOST || "localhost",
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || "wd_database"
    }
}

const pro = {
    app: {
        port: process.env.PPO_APP_PORT || 3000
    },
    db: {
        host: process.env.PPO_DB_HOST || "localhost",
        port: process.env.PPO_DB_PORT || 27017,
        name: process.env.PPO_DB_NAME || "shopPRO"
    }
}

const config = { dev, pro }

const env = process.env.NODE_ENV || "dev"
// console.log(config[env], env);
module.exports = config[env]