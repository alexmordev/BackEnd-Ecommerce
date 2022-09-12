'use strict';
const {UserSchema, USER_TABLE} = require('../models/user.model')
module.exports = {
  async up (queryInterface) {
    await queryInterface.addColumn( USER_TABLE, 'role', UserSchema.role);
    /**
     * Puedes agregar más cambios aquí....
     */
  },
  async down (queryInterface) {
    await queryInterface.removeColumn( USER_TABLE, 'role');
     /**
     * Pero recuerda agregarlos aca también 
     */
  }
};