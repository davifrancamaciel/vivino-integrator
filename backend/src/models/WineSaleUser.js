const db = require('../database');
const Company = require('./Company')(db.sequelize, db.Sequelize);
const User = require('./User')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const WineSaleUser = sequelize.define('wineSaleUsers', {
        userId: { type: DataTypes.INTEGER },
        companyId: { type: DataTypes.UUID },
        code: { type: DataTypes.STRING(20) },
    });

    WineSaleUser.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
    WineSaleUser.belongsTo(User, { foreignKey: 'userId', as: 'user' });
    return WineSaleUser;
};