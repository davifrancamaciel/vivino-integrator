const db = require('../database');
const Romanian = require('../models/Romanian')(db.sequelize, db.Sequelize);

const findOne = async (item) => {
    const { companyId, noteNumber, originCompanyId } = item;
    const isExists = await Romanian.findOne({
        where: { companyId, noteNumber, originCompanyId }
    })
    return isExists;
}


module.exports = { findOne }