'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addColumn('expenseTypes', "replicateNextMonth", {
        type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false
      }, { transaction });
      await queryInterface.addColumn('expenses', "replicateNextMonth", {
        type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false
      }, { transaction });

      await queryInterface.addColumn('expenseTypes', "description", {
        type: Sequelize.STRING(255), allowNull: true
      }, { transaction });
      await queryInterface.addColumn('companies', "companiesIds", { type: Sequelize.JSON, allowNull: true }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('expenseTypes', "replicateNextMonth"),
      queryInterface.removeColumn('expenseTypes', "description"),
      queryInterface.removeColumn('expenses', "replicateNextMonth"),
      queryInterface.removeColumn('companies', "companiesIds"),
    ]);
  },
};