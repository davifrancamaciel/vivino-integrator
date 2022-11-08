"use strict";

const { Op } = require('sequelize');
const db = require('../database');
const { startOfMonth, endOfMonth } = require('date-fns');
const Product = require('../models/Product')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../services/UserService");
const { roules } = require("../utils/defaultValues");

const { executeSelect } = require("../services/ExecuteQueryService");

module.exports.cards = async (event, context) => {
    try {
        const { pathParameters } = event;
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        const queryActive = `SELECT COUNT(id) count FROM products WHERE active = true AND inventoryCount > 0 AND bottleQuantity > 0`
        const [productsActive] = await executeSelect(queryActive);
        const queryNotActive = `SELECT COUNT(id) count FROM products WHERE active = false`
        const [productsNotActive] = await executeSelect(queryNotActive);


        let users = '', commission = '05'
        if (!checkRouleProfileAccess(user.groups, roules.administrator)) {
            users = `s.userId = '${user.sub}' AND`
            commission = '01'
        }

        if (user.sub === '7eaed82d-72e2-40c6-9de9-117f324f5530' || user.sub === '623be749-c4d7-4987-bb3d-5bdd1d810223') {
            users = `s.userId IN ('7eaed82d-72e2-40c6-9de9-117f324f5530', '623be749-c4d7-4987-bb3d-5bdd1d810223') AND`
            commission = '05'
        }

        const date = new Date();
        const querySales = `SELECT COUNT(s.id) count, SUM(s.value) totalValueMonth, SUM(s.value) * 0.${commission} commissionMonth FROM sales s 
                            WHERE ${users} s.createdAt BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}'`
        const [sales] = await executeSelect(querySales);

        return handlerResponse(200, { productsActive, productsNotActive, sales })
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

