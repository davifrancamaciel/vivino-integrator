const db = require('../database');
const Company = require('./Company')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const WineSale = sequelize.define('wineSales', {
        sale: { type: DataTypes.TEXT },
        saleFormatted: {
            type: DataTypes.VIRTUAL,
            get() {
                return JSON.parse(this.sale);
            },
        },
        code: { type: DataTypes.STRING(20) },
        value: { type: DataTypes.DECIMAL },
        companyId: { type: DataTypes.UUID },
        saleDate: { type: DataTypes.DATE },
        trackingUrl: { type: DataTypes.STRING(300) },
        noteNumber: { type: DataTypes.STRING(50) },
    });

    WineSale.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
    return WineSale;
};