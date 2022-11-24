module.exports = function (sequelize, DataTypes) {
    const ExpenseType = sequelize.define('expenseTypes', {
        name: { type: DataTypes.STRING(255) },
    });
    return ExpenseType;
};