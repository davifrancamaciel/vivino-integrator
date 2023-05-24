const db = require('../database');
const Company = require('./Company')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const Product = sequelize.define('products', {
        companyId: { type: DataTypes.UUID },
        name: { type: DataTypes.STRING(255) },
        price: { type: DataTypes.DECIMAL },
        image: { type: DataTypes.STRING(500) },
        description: { type: DataTypes.STRING(100) },
        inventoryCount: { type: DataTypes.INTEGER },
        size: { type: DataTypes.STRING(100) },
        color: { type: DataTypes.STRING(100) },
        ean: { type: DataTypes.STRING(100) },
        active: { type: DataTypes.BOOLEAN },
    });

    Product.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

    return Product;
};