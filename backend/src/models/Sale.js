const db = require('../database');
const Company = require('./Company')(db.sequelize, db.Sequelize);
const User = require('./User')(db.sequelize, db.Sequelize);
const SaleProduct = require('./SaleProduct')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const Sale = sequelize.define('sales', {
        products: { type: DataTypes.TEXT },
        productsFormatted: {
            type: DataTypes.VIRTUAL,
            get() {
                return JSON.parse(this.products);
            },
        },
        userId: { type: DataTypes.INTEGER },
        clientId: { type: DataTypes.INTEGER },
        note: { type: DataTypes.STRING(500) },
        value: { type: DataTypes.DECIMAL },
        companyId: { type: DataTypes.UUID },
        commission: { type: DataTypes.DECIMAL },
    });

    Sale.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
    Sale.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    Sale.belongsTo(User, { foreignKey: 'clientId', as: 'client' });
    Sale.hasMany(SaleProduct, { foreignKey: 'saleId', as: 'productsSales' })
    return Sale;
};