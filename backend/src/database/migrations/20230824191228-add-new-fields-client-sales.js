'use strict';

const { userType } = require("../../utils/defaultValues");

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('users', "phone", {
        type: Sequelize.STRING(30),
        allowNull: true,
      }),
      queryInterface.addColumn('users', "type", {
        type: Sequelize.STRING(30),
        allowNull: false,
        defaultValue: userType.USER
      }),
      queryInterface.addColumn('users', "dayMaturityFavorite", {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }),
      queryInterface.addColumn('expenses', "saleId", {
        type: Sequelize.INTEGER,
        references: { model: 'sales', key: 'id' },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
      queryInterface.addColumn('sales', "clientId", {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        allowNull: true,
        onUpdate: 'CASCADE',
      }),
      queryInterface.addColumn('companies', "pixKey", {
        type: Sequelize.STRING(100),
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('users', "phone"),
      queryInterface.removeColumn('users', "type"),
      queryInterface.removeColumn('users', "dayMaturityFavorite"),
      queryInterface.removeColumn('expenses', "saleId"),
      queryInterface.removeColumn('sales', "clientId"),
      queryInterface.removeColumn('companies', "pixKey"),
    ]);
  },
};