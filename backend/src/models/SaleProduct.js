const db = require('../database');
const Company = require('./Company')(db.sequelize, db.Sequelize);
const Product = require('./Product')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const SaleProduct = sequelize.define('saleProducts', {
        companyId: { type: DataTypes.UUID },
        saleId: { type: DataTypes.INTEGER },
        productId: { type: DataTypes.INTEGER },
        value: { type: DataTypes.DECIMAL },
        valueAmount: { type: DataTypes.DECIMAL },
        amount: { type: DataTypes.DECIMAL },        
    });

    SaleProduct.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
    SaleProduct.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
    return SaleProduct;
};