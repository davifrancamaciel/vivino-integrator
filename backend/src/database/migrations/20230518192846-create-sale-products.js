'use strict';

const TABLE_NAME = 'saleProducts';

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
      saleId: {
        type: Sequelize.INTEGER,
        references: { model: 'sales', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      productId: {
        type: Sequelize.INTEGER,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',        
        allowNull: false,
      },
      value: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      valueAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 1 },     
      createdAt: { type: Sequelize.DATE, allowNull: false, },
      updatedAt: { type: Sequelize.DATE, allowNull: false, },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  }
};
