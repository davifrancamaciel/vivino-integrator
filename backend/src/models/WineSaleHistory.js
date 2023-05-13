const db = require('../database');
const Company = require('./Company')(db.sequelize, db.Sequelize);
const Wine = require('./Wine')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const WineSaleHistory = sequelize.define('wineSaleHistories', {
        wineId: { type: DataTypes.INTEGER },
        companyId: { type: DataTypes.UUID },
        dateReference: { type: DataTypes.DATE },
        total: { type: DataTypes.INTEGER },
        inventoryCountBefore: { type: DataTypes.INTEGER },
        sales: { type: DataTypes.TEXT },
        salesFormatted: {
            type: DataTypes.VIRTUAL,
            get() {
                return JSON.parse(this.sales);
            },
        },
    });

    WineSaleHistory.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
    WineSaleHistory.belongsTo(Wine, { foreignKey: 'wineId', as: 'wine' });   
    return WineSaleHistory;
};