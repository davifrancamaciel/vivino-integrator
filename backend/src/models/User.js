const db = require('../database');
const Company = require('./Company')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('users', {
        name: { type: DataTypes.STRING(255) },
        email: { type: DataTypes.STRING(255) },
        userAWSId: { type: DataTypes.STRING(50) },
        companyId: { type: DataTypes.UUID },  
        commissionMonth: { type: DataTypes.DECIMAL },      
        phone: { type: DataTypes.STRING(30) },
        type: { type: DataTypes.STRING(30) },
        dayMaturityFavorite: { type: DataTypes.INTEGER },
    });
   
    User.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });    
    
    return User;
};