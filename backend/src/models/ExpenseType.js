const db = require('../database');

module.exports = function (sequelize, DataTypes) {
    const ExpenseType = sequelize.define('expenseTypes', {        
        name: { type: DataTypes.STRING(255) },
        description: { type: DataTypes.STRING(255) },
        replicateNextMonth: { type: DataTypes.BOOLEAN, defaultValue: false },
    });    

    return ExpenseType;
};