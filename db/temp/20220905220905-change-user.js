'use strict';
const { DataTypes } = require('sequelize');
const { COSTUMER_TABLE } = require('./../models/costumer.model');
const {USER_TABLE} = require('./../models/user.model');

module.exports = {
  async up (queryInterface) {
    await queryInterface.changeColumn( COSTUMER_TABLE,'user_id', {
        field:"user_id",
        allowNull: false,
        type: DataTypes.INTEGER,
        unique: false,
    });
  },
  async down (queryInterface) {
    await queryInterface.changeColumn( COSTUMER_TABLE,'user_id',{
      field:"user_id",
      allowNull: false,
      type: DataTypes.INTEGER,
      unique: true,
      references:{
          model: USER_TABLE, //importa tu modelo User
          key: 'id',
      },
      onUpdate: 'CASCADE', // Esto ocurre al actualizar, un efecto en cascada y tambien se actualiza
      onDelete: 'SET NULL' // Esto ocurre al borrar, se establece a null
  });
  }
};
