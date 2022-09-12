'use strict';
const { DataTypes } = require('sequelize');
const { COSTUMER_TABLE } = require('../models/costumer.model');
module.exports = {
  async up (queryInterface) {
    await queryInterface.changeColumn( COSTUMER_TABLE,'user_id',{
      field:"user_id",
        allowNull: false,
        type: DataTypes.INTEGER,
        unique: true
    });
  },
};