module.exports = function (sequelize, DataTypes) {
    const Sale = sequelize.define('sales', {
        product: { type: DataTypes.STRING(255) },
        userId: { type: DataTypes.STRING(50) },
        userName: { type: DataTypes.STRING(255) },
        note: { type: DataTypes.STRING(500) },   
        value: { type: DataTypes.DECIMAL },   
    });
    return Sale;
};