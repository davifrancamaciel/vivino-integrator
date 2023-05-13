'use strict';

const TABLE_NAME = 'users';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable(TABLE_NAME, {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
      },
      email: {
        type: Sequelize.STRING(255),
      },
      companyId: {
        type: Sequelize.UUID,
        references: { model: 'companies', key: 'id' },
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      userAWSId: { type: Sequelize.STRING(50) },
      commissionMonth: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0, },
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
