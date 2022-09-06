'use strict';

const TABLE_NAME = 'romanians';

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
        type: Sequelize.INTEGER,
        references: { model: 'companies', key: 'id' },
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      shippingCompanyId: {
        type: Sequelize.INTEGER,
        references: { model: 'shippingCompanies', key: 'id' },
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      noteNumber: { type: Sequelize.STRING(50), allowNull: true },
      noteValue: { type: Sequelize.STRING(50), allowNull: true },
      clientName: { type: Sequelize.STRING(255), allowNull: true },
      shippingValue: { type: Sequelize.STRING(50), allowNull: true },
      trackingCode: { type: Sequelize.STRING(255), allowNull: true, },
      originSale: { type: Sequelize.STRING(255), allowNull: true, },
      saleDateAt: { type: Sequelize.DATE, allowNull: false, },
      volume: { type: Sequelize.STRING(255), allowNull: true, },
      formOfPayment: { type: Sequelize.STRING(255), allowNull: true, },
      delivered: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, },
      createdAt: { type: Sequelize.DATE, allowNull: false, },
      updatedAt: { type: Sequelize.DATE, allowNull: false, },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  }
};
