const db = require('../database');
const Company = require('./Company')(db.sequelize, db.Sequelize);

module.exports = function (sequelize, DataTypes) {
    const Category = sequelize.define('categories', {
        companyId: { type: DataTypes.UUID }, 
        active: { type: DataTypes.BOOLEAN },
        name: { type: DataTypes.STRING(100) },        
    });
    
    Category.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
    
    return Category;
};