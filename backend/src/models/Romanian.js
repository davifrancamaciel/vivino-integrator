const db = require('../database');
const Company = require('./Company')(db.sequelize, db.Sequelize);
const ShippingCompany = require('./ShippingCompany')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const Romanian = sequelize.define('romanians', {
        noteNumber: { type: DataTypes.STRING(50) },
        noteValue: { type: DataTypes.STRING(50) },
        companyId: { type: DataTypes.UUID }, 
        clientName: { type: DataTypes.STRING(255) },
        shippingValue: { type: DataTypes.STRING(50) },
        trackingCode: { type: DataTypes.STRING(50) },
        volume: { type: DataTypes.STRING(255) },
        originSale: { type: DataTypes.STRING(255) },
        formOfPayment: { type: DataTypes.STRING(255) },
        saleDateAt: { type: DataTypes.DATE },
        delivered: { type: DataTypes.BOOLEAN },
        sended: { type: DataTypes.BOOLEAN },
        originCompanyId: { type: DataTypes.BOOLEAN },
    });
    
    Romanian.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
    Romanian.belongsTo(ShippingCompany, { foreignKey: 'shippingCompanyId', as: 'shippingCompany' });
    
    return Romanian;
};