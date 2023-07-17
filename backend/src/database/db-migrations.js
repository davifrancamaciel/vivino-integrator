//configurações usadas atualmente somente para rodar as migrations
const STAGE_IS_DEV = true ? 'dev' : 'prd'

const secrets = require(`../../secrets-${STAGE_IS_DEV}.json`);

module.exports = {
  dialect: 'mysql',
  host: secrets.DB_HOST,
  database: `services_db${STAGE_IS_DEV ? '_dev' : ''}`,
  // database: `services_db`,
  username: `root`,
  password: secrets.DB_PASSWORD,
  port: 3306,
  define: { timestamps: true },
};
