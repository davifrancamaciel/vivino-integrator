//configurações usadas atualmente somente para rodar as migrations
const STAGE = true ? 'dev' : 'prod'

const secrets = require(`../../secrets-${STAGE}.json`);

module.exports = {
  dialect: 'mysql',
  host: secrets.DB_HOST,
  database: `vivino_db`,
  username: `root`,
  password: secrets.DB_PASSWORD,
  port: 3306,
  define: { timestamps: true },
};
