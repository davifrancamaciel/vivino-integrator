const uuid = require('uuid');

module.exports = function (sequelize, DataTypes) {
    const Company = sequelize.define('companies', {
        name: { type: DataTypes.STRING(255) },
        active: { type: DataTypes.BOOLEAN },
        groups: { type: DataTypes.STRING(1000) },
        groupsFormatted: {
            type: DataTypes.VIRTUAL,
            get() {
                return this.groups ? JSON.parse(this.groups) : [];
            },
        },
        email: { type: DataTypes.STRING(150) },
        phone: { type: DataTypes.STRING(30) },
        vivinoId: { type: DataTypes.STRING(8) },
        vivinoClientId: { type: DataTypes.STRING(150) },
        vivinoClientSecret: { type: DataTypes.STRING(150) },
        vivinoClientUsername: { type: DataTypes.STRING(150) },
        vivinoPassword: { type: DataTypes.STRING(150) },
        vivinoAuthToken: { type: DataTypes.STRING(500) },
        vivinoApiIntegrationActive: { type: DataTypes.BOOLEAN },        
    });
    
    Company.beforeCreate(c => c.id = uuid.v4());

    return Company;
};