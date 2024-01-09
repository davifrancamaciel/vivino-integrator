'use strict';

const TABLE_NAME = 'wines';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(TABLE_NAME, "skuVivino", {
        type: Sequelize.STRING(100),
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(TABLE_NAME, "skuVivino"),
    ]);
  },
};
