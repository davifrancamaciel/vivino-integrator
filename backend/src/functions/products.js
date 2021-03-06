"use strict";

const { Op } = require('sequelize');
const db = require('../database');
const Product = require('../models/Product')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../utils/handleResponse");
const { getUser } = require("../services/UserService");

const RESOURCE_NAME = 'Vinho'

module.exports.list = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const whereStatement = {};

        if (event.queryStringParameters) {
            const { id, productName, producer, wineName, active, priceMin, priceMax } = event.queryStringParameters

            if (id) whereStatement.id = id;

            if (productName)
                whereStatement.productName = { [Op.like]: `%${productName}%` }
            if (producer)
                whereStatement.producer = { [Op.like]: `%${producer}%` }
            if (wineName)
                whereStatement.wineName = { [Op.like]: `%${wineName}%` }
            if (active !== undefined && active !== '')
                whereStatement.active = active === 'true';

            if (priceMin)
                whereStatement.price = {
                    [Op.gte]: Number(priceMin),
                };
            if (priceMax)
                whereStatement.price = {
                    [Op.lte]: Number(priceMax),
                };
            if (priceMin && priceMax)
                whereStatement.price = {
                    [Op.between]: [
                        Number(priceMin),
                        Number(priceMax),
                    ],
                };
        }

        const { pageSize, pageNumber } = event.queryStringParameters
        const { count, rows } = await Product.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * 10,
            order: [['id', 'DESC']],
        })

        return handlerResponse(200, { count, rows })

    } catch (err) {
        return handlerErrResponse(err)
    }
};

module.exports.listById = async (event) => {
    const { pathParameters } = event
    try {
        const result = await Product.findByPk(pathParameters.id)
        if (!result)
            return handlerResponse(400, {}, `${RESOURCE_NAME} n??o encontrado`)

        return handlerResponse(200, result)
    } catch (err) {
        return handlerErrResponse(err, pathParameters)
    }
}

module.exports.create = async (event) => {
    const body = JSON.parse(event.body)
    try {

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usu??rio n??o encontrado')

        if (!user.havePermissionApprover)
            return handlerResponse(403, {}, 'Usu??rio n??o tem permiss??o acessar esta funcionalidade')

        const { id } = body
        const result = await Product.create({ id: Number(id), ...body });
        return handlerResponse(201, result, `${RESOURCE_NAME} criado com sucesso`)
    } catch (err) {
        return handlerErrResponse(err, body)
    }
}

module.exports.update = async (event) => {
    const body = JSON.parse(event.body)
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usu??rio n??o encontrado')

        if (!user.havePermissionApprover)
            return handlerResponse(403, {}, 'Usu??rio n??o tem permiss??o acessar esta funcionalidade')

        const { id } = body
        const item = await Product.findByPk(Number(id))
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} n??o encontrado`)

        const result = await item.update(body);

        return handlerResponse(200, result, `${RESOURCE_NAME} alterado com sucesso`)
    } catch (err) {
        return handlerErrResponse(err, body)
    }
}



module.exports.delete = async (event) => {
    const { pathParameters } = event
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usu??rio n??o encontrado')

        if (!user.havePermissionApprover)
            return handlerResponse(403, {}, 'Usu??rio n??o tem permiss??o acessar esta funcionalidade')

        const { id } = pathParameters
        await Product.destroy({ where: { id } });
        return handlerResponse(200, {}, `${RESOURCE_NAME} c??digo (${id}) removido com sucesso`)
    } catch (err) {
        return handlerErrResponse(err, pathParameters)
    }
}