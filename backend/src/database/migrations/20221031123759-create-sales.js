'use strict';

const TABLE_NAME = 'sales';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable(TABLE_NAME, {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      products: {
        type: Sequelize.TEXT,
      },
      value: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0, },
      userId: { type: Sequelize.STRING(50) },
      userName: { type: Sequelize.STRING(255) },
      note: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  }
};
