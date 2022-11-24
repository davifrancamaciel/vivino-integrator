'use strict';

const TABLE_NAME = 'expenses';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable(TABLE_NAME, {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      expenseTypeId: {
        type: Sequelize.INTEGER,
        references: { model: 'expenseTypes', key: 'id' },
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      value: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0, },
      title: { type: Sequelize.STRING(256), allowNull: true, },
      description: { type: Sequelize.STRING(1000), allowNull: true, },
      paidOut: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true, },
      paymentDate: { type: Sequelize.DATE, allowNull: false, defaultValue: new Date() },
      createdAt: { type: Sequelize.DATE, allowNull: false, },
      updatedAt: { type: Sequelize.DATE, allowNull: false, },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  }
};
