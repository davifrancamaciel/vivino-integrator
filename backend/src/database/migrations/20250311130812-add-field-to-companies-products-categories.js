'use strict';

const TABLE_NAME = 'categories';
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
          onDelete: 'CASCADE',
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(100),
        },
        active: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        createdAt: { type: Sequelize.DATE, allowNull: false, },
        updatedAt: { type: Sequelize.DATE, allowNull: false, },
      }, { transaction });

      await queryInterface.addColumn('companies', "open", {
        type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true
      }, { transaction }),

        await queryInterface.addColumn('companies', "banner", {
          type: Sequelize.STRING(300), allowNull: true
        }, { transaction }),

        await queryInterface.addColumn('products', "categoryId", {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: { model: 'categories', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }, { transaction }),
        await queryInterface.addIndex('products', ['categoryId'], { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.dropTable(TABLE_NAME),
      queryInterface.removeColumn('companies', "open"),
      queryInterface.removeColumn('companies', "banner"),
      queryInterface.removeColumn('products', "categoryId"),
    ]);
  },
};