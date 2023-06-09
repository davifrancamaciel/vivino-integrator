'use strict';

const TABLE_NAME = 'expenses';

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
        expenseTypeId: {
          type: Sequelize.INTEGER,
          references: { model: 'expenseTypes', key: 'id' },
          onUpdate: 'CASCADE',
          allowNull: false,
        },
        expenseDadId: {
          type: Sequelize.INTEGER,
          references: { model: 'expenses', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          allowNull: true,
        },
        value: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0, },
        title: { type: Sequelize.STRING(256), allowNull: true, },
        description: { type: Sequelize.STRING(1000), allowNull: true, },
        paidOut: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true, },
        paymentDate: { type: Sequelize.DATE, allowNull: false, defaultValue: new Date() },
        createdAt: { type: Sequelize.DATE, allowNull: false, },
        updatedAt: { type: Sequelize.DATE, allowNull: false, },
      });
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
