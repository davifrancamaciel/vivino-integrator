'use strict';

const TABLE_NAME = 'products';

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
        allowNull: false,
      },
      name: { type: Sequelize.STRING(255), },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      image: { type: Sequelize.STRING(500), allowNull: true, },
      description: { type: Sequelize.STRING(500), allowNull: true, },
      inventoryCount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      size: { type: Sequelize.STRING(100), allowNull: true, },
      color: { type: Sequelize.STRING(100), allowNull: true, },
      ean: { type: Sequelize.STRING(100), allowNull: true, },
      active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true, },
      createdAt: { type: Sequelize.DATE, allowNull: false, },
      updatedAt: { type: Sequelize.DATE, allowNull: false, },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  }
};
