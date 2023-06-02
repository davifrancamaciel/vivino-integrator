'use strict';

const TABLE_NAME = 'wineSaleHistories';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable(TABLE_NAME, {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      companyId: {
        type: Sequelize.UUID,
        references: { model: 'companies', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      wineId: {
        type: Sequelize.INTEGER,
        references: { model: 'wines', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      }, 
      total: { type: Sequelize.INTEGER, allowNull: false, },
      inventoryCountBefore: { type: Sequelize.INTEGER, allowNull: false, },
      sales: { type: Sequelize.TEXT, allowNull: true, },
      dateReference: { type: Sequelize.DATE, allowNull: false, },
      createdAt: { type: Sequelize.DATE, allowNull: false, },
      updatedAt: { type: Sequelize.DATE, allowNull: false, },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  }
};
