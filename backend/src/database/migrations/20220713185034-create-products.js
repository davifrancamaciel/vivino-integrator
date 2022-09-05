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
      productName: { type: Sequelize.STRING(255), },
      productName: { type: Sequelize.STRING(255), allowNull: true, },
      price: { type: Sequelize.STRING(100), allowNull: true, },
      quantityIsMinimum: { type: Sequelize.BOOLEAN, allowNull: true, },
      bottleSize: { type: Sequelize.STRING(100), allowNull: true, },
      bottleQuantity: { type: Sequelize.INTEGER, allowNull: true, },
      link: { type: Sequelize.STRING(300), allowNull: true, },
      inventoryCount: { type: Sequelize.INTEGER, allowNull: true, },
      producer: { type: Sequelize.STRING(100), allowNull: true, },
      wineName: { type: Sequelize.STRING(255), allowNull: true, },
      appellation: { type: Sequelize.STRING(100), allowNull: true, },
      vintage: { type: Sequelize.STRING(100), allowNull: true, },
      country: { type: Sequelize.STRING(100), allowNull: true, },
      color: { type: Sequelize.STRING(100), allowNull: true, },
      image: { type: Sequelize.STRING(500), allowNull: true, },
      ean: { type: Sequelize.STRING(100), allowNull: true, },
      description: { type: Sequelize.STRING(500), allowNull: true, },
      alcohol: { type: Sequelize.STRING(100), allowNull: true, },
      producerAddress: { type: Sequelize.STRING(100), allowNull: true, },
      importerAddress: { type: Sequelize.STRING(100), allowNull: true, },
      varietal: { type: Sequelize.STRING(100), allowNull: true, },
      ageing: { type: Sequelize.STRING(100), allowNull: true, },
      closure: { type: Sequelize.STRING(100), allowNull: true, },
      winemaker: { type: Sequelize.STRING(100), allowNull: true, },
      productionSize: { type: Sequelize.STRING(100), allowNull: true, },
      residualSugar: { type: Sequelize.STRING(100), allowNull: true, },
      acidity: { type: Sequelize.STRING(100), allowNull: true, },
      ph: { type: Sequelize.STRING(100), allowNull: true, },
      containsMilkAllergens: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, },
      containsEggAllergens: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, },
      nonAlcoholic: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, },
      active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true, },
      createdAt: { type: Sequelize.DATE, allowNull: false, },
      updatedAt: { type: Sequelize.DATE, allowNull: false, },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  }
};
