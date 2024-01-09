"use strict";

const { Op } = require('sequelize');
const db = require('../../database');
const { startOfDay, endOfDay, parseISO } = require('date-fns');
const WineSaleHistory = require('../../models/WineSaleHistory')(db.sequelize, db.Sequelize);
const Wine = require('../../models/Wine')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { roules } = require("../../utils/defaultValues");

module.exports.list = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        let whereStatement = {}, whereStatementWine = {};

        const { pageSize, pageNumber, wineId, companyId, skuVivino,
            dateReferenceStart, dateReferenceEnd, createdAtStart, createdAtEnd, productName } = event.queryStringParameters

        if (companyId) whereStatement.companyId = companyId;

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.wines))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')
        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId

        if (wineId) whereStatement.wineId = wineId;

        if (dateReferenceStart)
            whereStatement.dateReference = {
                [Op.gte]: startOfDay(parseISO(dateReferenceStart)),
            };

        if (dateReferenceEnd)
            whereStatement.dateReference = {
                [Op.lte]: endOfDay(parseISO(dateReferenceEnd)),
            };
        if (dateReferenceStart && dateReferenceEnd)
            whereStatement.dateReference = {
                [Op.between]: [
                    startOfDay(parseISO(dateReferenceStart)),
                    endOfDay(parseISO(dateReferenceEnd)),
                ],
            };

        if (createdAtStart)
            whereStatement.createdAt = {
                [Op.gte]: startOfDay(parseISO(createdAtStart)),
            };

        if (createdAtEnd)
            whereStatement.createdAt = {
                [Op.lte]: endOfDay(parseISO(createdAtEnd)),
            };
        if (createdAtStart && createdAtEnd)
            whereStatement.createdAt = {
                [Op.between]: [
                    startOfDay(parseISO(createdAtStart)),
                    endOfDay(parseISO(createdAtEnd)),
                ],
            };

        if (productName)
            whereStatementWine.productName = { [Op.like]: `%${productName}%` }

        if (skuVivino)
            whereStatementWine.skuVivino = skuVivino

        const { count, rows } = await WineSaleHistory.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * pageSize,
            order: [['createdAt', 'DESC']],
            include: [{
                model: Wine,
                as: 'wine',
                attributes: ['productName', 'image', 'inventoryCount', 'skuVivino'],
                where: whereStatementWine
            }]
        })
        return handlerResponse(200, { count, rows })
    } catch (err) {
        return await handlerErrResponse(err)
    }
};