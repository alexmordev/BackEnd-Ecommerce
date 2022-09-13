const { config } = require('../config/config');

module.exports = {
    development:{
        url: config.dbURL,
        dialect: 'postgres',
    },
    production:{
        url:config.dbURL,
        dialect: 'postgres',
        dialectOptions:{
            ssl:{
                rejectUnauthorized: false
            }
        }
    }
}