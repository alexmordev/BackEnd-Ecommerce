'use strict';
const {CostumerSchema, COSTUMER_TABLE} = require('../models/costumer.model');
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable( COSTUMER_TABLE, CostumerSchema );
  },

  async down (queryInterface) {
    await queryInterface.dropTable( COSTUMER_TABLE );
  }
};
