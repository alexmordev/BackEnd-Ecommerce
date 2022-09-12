'use strict';
const {CostumerSchema, COSTUMER_TABLE} = require('../models/costumer.model');
module.exports = {
  async up (queryInterface) {
    await queryInterface.dropTable( COSTUMER_TABLE, CostumerSchema );
  },
};
