
const dev = {
    db: {
        connectString: process.env.DEV_CONNECTSTRING || "mongodb://localhost:27017/wd_shop"
    }
}

const pro = {
    // app: {
    //     port: process.env.PPO_APP_PORT || 3000
    // },
    db: {
        connectString: process.env.PRO_CONNECTSTRING
    }
}

const config = { dev, pro }

const env = process.env.NODE_ENV || "dev"
// console.log(config[env], env);
module.exports = config[env]