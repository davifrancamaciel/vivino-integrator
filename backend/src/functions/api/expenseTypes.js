"use strict";

const { Op } = require('sequelize');
const { startOfDay, endOfDay, parseISO } = require('date-fns');
const db = require('../../database');
const ExpenseType = require('../../models/ExpenseType')(db.sequelize, db.Sequelize);
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { roules } = require("../../utils/defaultValues");
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");

const RESOURCE_NAME = 'Tipo de Despesa'

module.exports.list = async (event, context) => {
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        context.callbackWaitsForEmptyEventLoop = false;

        const whereStatement = {};

        if (event.queryStringParameters) {
            const { id, name, description, createdAtStart, createdAtEnd } = event.queryStringParameters

            if (id) whereStatement.id = id;

            if (name)
                whereStatement.name = { [Op.like]: `%${name}%` }

            if (description)
                whereStatement.description = { [Op.like]: `%${description}%` }

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
        }

        const { pageSize, pageNumber } = event.queryStringParameters
        const { count, rows } = await ExpenseType.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * Number(pageSize),
            order: [['id', 'DESC']],
        })

        return handlerResponse(200, { count, rows })

    } catch (err) {
        return await handlerErrResponse(err)
    }
};

module.exports.listById = async (event) => {
    const { pathParameters } = event
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.developers))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const result = await ExpenseType.findByPk(pathParameters.id)
        if (!result)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrado`)

        return handlerResponse(200, result)
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
    }
}

module.exports.create = async (event) => {
    const body = JSON.parse(event.body)
    try {

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.developers))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        let objOnSave = body

        const result = await ExpenseType.create(objOnSave);

        return handlerResponse(201, result, `${RESOURCE_NAME} criado com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, body)
    }
}

module.exports.update = async (event) => {
    const body = JSON.parse(event.body)
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.developers))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = body
        const item = await ExpenseType.findByPk(Number(id))

        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrado`)

        const result = await item.update(body);

        return handlerResponse(200, result, `${RESOURCE_NAME} alterado com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, body)
    }
}

module.exports.delete = async (event) => {
    const { pathParameters } = event
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.developers))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = pathParameters
        const item = await ExpenseType.findByPk(id)

        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrado`)

        await ExpenseType.destroy({ where: { id } });

        return handlerResponse(200, {}, `${RESOURCE_NAME} código (${id}) removido com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
    }
}

module.exports.listAll = async (event) => {
    const { queryStringParameters } = event
    try {

        const whereStatement = {};
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, `Usuário não encontrado`)

        const resp = await ExpenseType.findAll({
            where: whereStatement,
            attributes: ['id', 'name', 'description', 'replicateNextMonth'],
            order: [['name', 'ASC']],
        })

        const respFormated = resp.map(item => ({
            value: item.id,
            label: item.name,
            description: item.description,
            replicateNextMonth: item.replicateNextMonth
        }));
        return handlerResponse(200, respFormated)
    } catch (err) {
        return await handlerErrResponse(err, queryStringParameters)
    }
}
