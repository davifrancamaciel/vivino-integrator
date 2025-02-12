//configurações usadas atualmente somente para rodar as migrations
const STAGE_IS_DEV = true
const STAGE = STAGE_IS_DEV ? 'dev' : 'prd'
const secrets = require(`../../secrets-${STAGE}.json`);

const database = `services_db${STAGE_IS_DEV ? '_dev' : ''}`;
console.log(`database selected -> ${database}`)
module.exports = {
  dialect: 'mysql',
  host: secrets.DB_HOST,
  database,
  // database: `services_db`,
  username: `root`,
  password: secrets.DB_PASSWORD,
  port: 3306,
  define: { timestamps: true },
};
