'use strict';

const TABLE_NAME = 'users';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([     
      queryInterface.addColumn(TABLE_NAME, "phone", {
        type: Sequelize.STRING(30),
        allowNull: true,
      })
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([      
      queryInterface.removeColumn(TABLE_NAME, "phone"),     
    ]);
  },
};