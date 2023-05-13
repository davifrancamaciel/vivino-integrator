'use strict';

const TABLE_NAME = 'companies';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable(TABLE_NAME, {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,        
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
      },
      groups: {
        type: Sequelize.STRING(1000),
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
