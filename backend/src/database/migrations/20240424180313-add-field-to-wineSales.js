'use strict';

const TABLE_NAME = 'wineSales';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(TABLE_NAME, "trackingUrl", {
        type: Sequelize.STRING(300),
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(TABLE_NAME, "trackingUrl"),
    ]);
  },
};
