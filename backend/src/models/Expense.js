const db = require('../database');
const ExpenseType = require('./ExpenseType')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const Expense = sequelize.define('romanians', {
        expenseTypeId: { type: DataTypes.INTEGER },
        value: { type: DataTypes.DECIMAL },
        title: { type: DataTypes.STRING(256) },
        description: { type: DataTypes.STRING(1000) },
        paidOut: { type: DataTypes.BOOLEAN },
        paymentDate: { type: DataTypes.DATE },       
    });
    Expense.belongsTo(ExpenseType, { foreignKey: 'expenseTypeId', as: 'expenseTypes' });
    
    return Expense;
};