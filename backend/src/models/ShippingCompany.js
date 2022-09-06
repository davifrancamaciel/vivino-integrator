module.exports = function (sequelize, DataTypes) {
    const ShippingCompany = sequelize.define('shippingCompanies', {
        name: { type: DataTypes.STRING(255) },
    });
    return ShippingCompany;
};