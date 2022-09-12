const { Sequelize } = require('sequelize');
const { config } = require('../config/config');
const setupModels = require('../db/models');

const USER = encodeURIComponent( config.dbUser );
const PASSWORD = encodeURIComponent( config.dbPassword );
const URL = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const sequelize =  new Sequelize(URL,{
    dialect: 'postgres',
    logging: true, //mostrar la traducción a sql de las peticioes hechas
})

setupModels(sequelize);

// sequelize.sync( ); //No es la mejor practica es mejor usar migraciones

module.exports = sequelize;