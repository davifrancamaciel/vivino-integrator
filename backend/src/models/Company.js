module.exports = function (sequelize, DataTypes) {
    const Company = sequelize.define('companies', {
        name: { type: DataTypes.STRING(255) },
    });
    return Company;
};