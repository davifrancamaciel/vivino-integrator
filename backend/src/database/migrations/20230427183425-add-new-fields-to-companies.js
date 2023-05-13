'use strict';

const TABLE_NAME = 'companies';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(TABLE_NAME, "email", {
        type: Sequelize.STRING(150),
        allowNull: true,
      }),
      queryInterface.addColumn(TABLE_NAME, "phone", {
        type: Sequelize.STRING(30),
        allowNull: true,
      }),
      queryInterface.addColumn(TABLE_NAME, "vivinoId", {
        type: Sequelize.STRING(8),
        allowNull: true,
      }),
      queryInterface.addColumn(TABLE_NAME, "vivinoClientId", {
        type: Sequelize.STRING(150),
        allowNull: true,
      }),
      queryInterface.addColumn(TABLE_NAME, "vivinoClientSecret", {
        type: Sequelize.STRING(150),
        allowNull: true,
      }),
      queryInterface.addColumn(TABLE_NAME, "vivinoClientUsername", {
        type: Sequelize.STRING(150),
        allowNull: true,
      }),
      queryInterface.addColumn(TABLE_NAME, "vivinoPassword", {
        type: Sequelize.STRING(150),
        allowNull: true,
      }),
      queryInterface.addColumn(TABLE_NAME, "vivinoAuthToken", {
        type: Sequelize.STRING(500),
        allowNull: true,
      }),
      queryInterface.addColumn(TABLE_NAME, "vivinoApiIntegrationActive", {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(TABLE_NAME, "email"),
      queryInterface.removeColumn(TABLE_NAME, "phone"),
      queryInterface.removeColumn(TABLE_NAME, "vivinoId"),
      queryInterface.removeColumn(TABLE_NAME, "vivinoClientId"),
      queryInterface.removeColumn(TABLE_NAME, "vivinoClientSecret"),
      queryInterface.removeColumn(TABLE_NAME, "vivinoClientUsername"),
      queryInterface.removeColumn(TABLE_NAME, "vivinoPassword"),
      queryInterface.removeColumn(TABLE_NAME, "vivinoAuthToken"),
      queryInterface.removeColumn(TABLE_NAME, "vivinoApiIntegrationActive"),
    ]);
  },
};