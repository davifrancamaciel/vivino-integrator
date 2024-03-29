const db = require('../database');
const Company = require('./Company')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const Wine = sequelize.define('wines', {
        productName: { type: DataTypes.STRING(255) },
        price: { type: DataTypes.STRING(100) },
        quantityIsMinimum: { type: DataTypes.BOOLEAN },
        bottleSize: { type: DataTypes.STRING(100) },
        bottleQuantity: { type: DataTypes.INTEGER },
        link: { type: DataTypes.STRING(100) },
        inventoryCount: { type: DataTypes.INTEGER },
        producer: { type: DataTypes.STRING(100) },
        wineName: { type: DataTypes.STRING(255) },
        appellation: { type: DataTypes.STRING(100) },
        vintage: { type: DataTypes.STRING(100) },
        country: { type: DataTypes.STRING(100) },
        color: { type: DataTypes.STRING(100) },
        image: { type: DataTypes.STRING(100) },
        ean: { type: DataTypes.STRING(100) },
        description: { type: DataTypes.STRING(100) },
        alcohol: { type: DataTypes.STRING(100) },
        producerAddress: { type: DataTypes.STRING(100) },
        importerAddress: { type: DataTypes.STRING(100) },
        varietal: { type: DataTypes.STRING(100) },
        ageing: { type: DataTypes.STRING(100) },
        closure: { type: DataTypes.STRING(100) },
        winemaker: { type: DataTypes.STRING(100) },
        productionSize: { type: DataTypes.STRING(100) },
        residualSugar: { type: DataTypes.STRING(100) },
        acidity: { type: DataTypes.STRING(100) },
        ph: { type: DataTypes.STRING(100) },
        containsMilkAllergens: { type: DataTypes.BOOLEAN },
        containsEggAllergens: { type: DataTypes.BOOLEAN },
        nonAlcoholic: { type: DataTypes.BOOLEAN },
        active: { type: DataTypes.BOOLEAN },        
        companyId: { type: DataTypes.UUID }, 
        skuVivino: { type: DataTypes.STRING(100) },
    });
    
    Wine.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });  

    return Wine;
};