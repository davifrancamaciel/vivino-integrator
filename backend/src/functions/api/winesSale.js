"use strict";

const { Op } = require('sequelize');
const db = require('../../database');
const { startOfDay, endOfDay, parseISO } = require('date-fns');
const WineSale = require('../../models/WineSale')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { roules } = require("../../utils/defaultValues");

module.exports.list = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        let whereStatement = {};

        const { pageSize, pageNumber, code, saleDateStart, saleDateEnd, createdAtStart, createdAtEnd, sale } = event.queryStringParameters

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.wines))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')
        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId

        if (code) whereStatement.code = code;

        if (saleDateStart)
            whereStatement.saleDate = {
                [Op.gte]: startOfDay(parseISO(saleDateStart)),
            };

        if (saleDateEnd)
            whereStatement.saleDate = {
                [Op.lte]: endOfDay(parseISO(saleDateEnd)),
            };
        if (saleDateStart && saleDateEnd)
            whereStatement.saleDate = {
                [Op.between]: [
                    startOfDay(parseISO(saleDateStart)),
                    endOfDay(parseISO(saleDateEnd)),
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

        if (sale)
            whereStatement.sale = { [Op.like]: `%${sale}%` }

        const { count, rows } = await WineSale.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * pageSize,
            order: [['id', 'DESC']],
        })
        return handlerResponse(200, { count, rows })
    } catch (err) {
        return await handlerErrResponse(err)
    }
};