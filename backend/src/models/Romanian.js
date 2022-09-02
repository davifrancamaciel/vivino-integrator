const db = require('../database');
const Company = require('./Company')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const Romanian = sequelize.define('romanians', {
        noteNumber: { type: DataTypes.STRING(50) },
        noteValue: { type: DataTypes.STRING(50) },
        companyId: { type: DataTypes.INTEGER },
        clientName: { type: DataTypes.STRING(255) },
        shippingCompanyName: { type: DataTypes.STRING(255) },
        shippingValue: { type: DataTypes.STRING(50) },
        trackingCode: { type: DataTypes.STRING(50) },
        originSale: { type: DataTypes.STRING(255) },
        saleDateAt: { type: DataTypes.DATE },
    });
    Romanian.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
    return Romanian;
};