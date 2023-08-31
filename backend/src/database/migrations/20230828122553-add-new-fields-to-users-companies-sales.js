'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('users', "active", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }),
      
      queryInterface.addColumn('sales', "commission", {
        type: Sequelize.DECIMAL(10, 2),      
        allowNull: false,
        defaultValue: 0.00,
      }),
      queryInterface.addColumn('companies', "individualCommission", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('users', "active"),
      queryInterface.removeColumn('sales', "commission"),
      queryInterface.removeColumn('companies', "individualCommission"),
    ]);
  },
};