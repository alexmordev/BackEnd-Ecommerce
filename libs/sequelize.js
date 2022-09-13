const { Sequelize } = require('sequelize');
const { config } = require('../config/config');
const setupModels = require('../db/models');

const options = {
    dialect: 'postgres',
    logging: config.isProduction ? false : true, //mostrar la traducción a sql de las peticioes hechas
}
if(config.isProduction){
    options.dialectOptions = {
        ssl:{
            rejectUnauthorized: false
        }
    }
}
const sequelize =  new Sequelize(config.dbURL, options )
setupModels(sequelize);

// sequelize.sync( ); //No es la mejor practica es mejor usar migraciones

module.exports = sequelize;