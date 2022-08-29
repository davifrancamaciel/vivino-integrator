"use strict";

const { Op } = require('sequelize');
const db = require('../database');
const Product = require('../models/Product')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../utils/handleResponse");
const { getUser } = require("../services/UserService");
const { executeSelect } = require("../services/ExecuteQueryService");

module.exports.productsByStatus = async (event, context) => {
    try {
        const { pathParameters } = event;
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        const and = `AND inventoryCount > 0 AND bottleQuantity > 0`

        const { active } = pathParameters
        const query = `SELECT COUNT(id) count FROM products WHERE active = ${active} ${active === 'true' ? and : ''}`
        const [result] = await executeSelect(query);

        return handlerResponse(200, result)
    } catch (err) {
        return handlerErrResponse(err)
    }
};

module.exports.productsWarning = async (event) => {
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        const result = await Product.findAll({
            where: {
                active: true,
                [Op.or]: {
                    inventoryCount: { [Op.lt]: 1 },
                    bottleQuantity: { [Op.lt]: 1 }
                }
            },
            order: [['id', 'DESC']],
            limit: 50,
        })

        return handlerResponse(200, result)
    } catch (err) {
        return handlerErrResponse(err)
    }
};

