module.exports = function (sequelize, DataTypes) {
    const Sale = sequelize.define('sales', {
        products: { type: DataTypes.STRING(1000) },
        productsFormatted: {
            type: DataTypes.VIRTUAL,
            get() {
                return JSON.parse(this.products);
            },
        },
        userId: { type: DataTypes.STRING(50) },
        userName: { type: DataTypes.STRING(255) },
        note: { type: DataTypes.STRING(500) },
        value: { type: DataTypes.DECIMAL },
    });
    return Sale;
};