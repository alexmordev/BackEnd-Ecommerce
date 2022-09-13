'use strict';
const { ORDER_TABLE} = require('../models/order.model');
const { COSTUMER_TABLE } = require('../models/costumer.model');
const { DataTypes, Sequelize } = require('sequelize');

module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable( ORDER_TABLE , 
      {
        id:{
            allowNull:false, //no puede ser falso
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        createdAt:{
            allowNull: false,
            type: DataTypes.DATE,
            field: 'created_at',
            defaultValue: Sequelize.NOW,
        },
        costumerId:{
            field:"costumer_id",
            allowNull: false,
            type: DataTypes.INTEGER,
            references:{
                model: COSTUMER_TABLE, //importa tu modelo User
                key: 'id',
            },
            onUpdate: 'CASCADE', // Esto ocurre al actualizar, un efecto en cascada y tambien se actualiza
            onDelete: 'SET NULL' // Esto ocurre al borrar, se establece a null
        }
      }

    );

  },
  async down (queryInterface) {
    await queryInterface.dropTable( ORDER_TABLE );
  }
};
