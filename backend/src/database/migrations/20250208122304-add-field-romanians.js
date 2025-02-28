'use strict';

const TABLE_NAME = 'romanians';

module.exports = {
  async up(queryInterface, Sequelize) {

    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(TABLE_NAME, "sended", {
        type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false
      }, { transaction }),

        await queryInterface.addColumn(TABLE_NAME, "originCompanyId", {
          type: Sequelize.INTEGER, allowNull: false, defaultValue: 1,
        }, { transaction }),
        await queryInterface.addIndex(TABLE_NAME, ['noteNumber'], { transaction });
        await queryInterface.addIndex(TABLE_NAME, ['originCompanyId'], { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },


  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(TABLE_NAME, "sended"),
      queryInterface.removeColumn(TABLE_NAME, "originCompanyId"),
    ]);
  },
};
