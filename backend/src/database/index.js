const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,//.replace("_dev", ""),
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        //logging: true,//!!process.env.IS_OFFLINE, //imprme log de banco somente se estiver rodando local
        logging: (str) => console.log(str),
        dialect: 'mysql',
        operatorsAliases: 0,
        define: { timestamps: true },
        pool: {
            max: 5,
            min: 0,
            acquire: 20000,
            idle: 10000
        }
    });

module.exports = { 'Sequelize': Sequelize, 'sequelize': sequelize };