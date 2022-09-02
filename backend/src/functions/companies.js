"use strict";

const db = require('../database');
const Company = require('../models/Company')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../utils/handleResponse");

module.exports.listAll = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const resp = await Company.findAll({
            attributes: ['id', 'name'],
            order: [['name', 'ASC']],
        })

        const respFormated = resp.map(item => ({
            value: item.id,
            label: item.name,
        }));
        return handlerResponse(200, respFormated)
    } catch (err) {
        return handlerErrResponse(err)
    }
};