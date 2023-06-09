'use strict';

const TABLE_NAME = 'wineSales';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
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
        code: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        sale: {
          type: Sequelize.TEXT,
        },
        value: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0, },
        saleDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      }, { transaction });
      await queryInterface.addIndex(TABLE_NAME, ['saleDate'], { transaction }); 
      await queryInterface.addIndex(TABLE_NAME, ['code'], { transaction });
      await queryInterface.addIndex(TABLE_NAME, ['companyId'], { transaction });
      await queryInterface.addIndex(TABLE_NAME, ['createdAt'], { transaction });      
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  }
};
