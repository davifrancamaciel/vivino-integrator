"use strict";

const db = require('../../database');
const ExpenseType = require('../../models/ExpenseType')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");

module.exports.listAll = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const resp = await ExpenseType.findAll({
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