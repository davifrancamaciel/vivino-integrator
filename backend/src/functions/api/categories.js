"use strict";

const { Op } = require('sequelize');
const { startOfDay, endOfDay, parseISO, addMonths } = require('date-fns');
const db = require('../../database');
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const Category = require('../../models/Category')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { roules } = require("../../utils/defaultValues");

const RESOURCE_NAME = 'Categoria'

module.exports.list = async (event, context) => {
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        context.callbackWaitsForEmptyEventLoop = false;

        const whereStatement = {};
        const whereCompanys = {};

        if (event.queryStringParameters) {
            const {
                id, companyName, name, active, createdAtStart, createdAtEnd
            } = event.queryStringParameters

            if (id) whereStatement.id = id;

            if (companyName)
                whereCompanys.name = { [Op.like]: `%${companyName}%` }

            if (active !== undefined && active !== '')
                whereStatement.active = active === 'true';

            if (name)
                whereStatement.name = { [Op.like]: `%${name}%` }

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

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId;

        const { pageSize, pageNumber } = event.queryStringParameters
        const { count, rows } = await Category.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * Number(pageSize),
            order: [['id', 'DESC']],
            include: [
                {
                    model: Company,
                    as: 'company',
                    attributes: ['name'],
                    where: whereCompanys
                }
            ]
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
        if (!checkRouleProfileAccess(user.groups, roules.categoryes))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const result = await Category.findByPk(pathParameters.id, {
            include: [
                {
                    model: Company,
                    as: 'company',
                    attributes: ['name'],
                }]
        })
        if (!result)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada`)

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && result.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

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

        if (!checkRouleProfileAccess(user.groups, roules.categoryes))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        let objOnSave = body
        objOnSave.dividedIn = Number(body.dividedIn || 1);

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            objOnSave.companyId = user.companyId

        const result = await Category.create(objOnSave);

        return handlerResponse(201, result, `${RESOURCE_NAME} criada com sucesso`)
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

        if (!checkRouleProfileAccess(user.groups, roules.categoryes))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = body
        const item = await Category.findByPk(Number(id))

        console.log('BODY ', body)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada`)

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        const result = await item.update(body);
        console.log('PARA ', result.dataValues)

        return handlerResponse(200, result, `${RESOURCE_NAME} alterada com sucesso`)
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

        if (!checkRouleProfileAccess(user.groups, roules.categoryes))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = pathParameters
        const item = await Category.findByPk(id)
        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');
        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.CompanyId === 1)
            return handlerResponse(403, {}, 'Usuário não tem permissão apagar este tipo de despesa')

        await Category.destroy({ where: { id } });
        return handlerResponse(200, {}, `${RESOURCE_NAME} código (${id}) removida com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
    }
}

module.exports.listAll = async (event, context) => {
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.categoryes))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')
        const whereStatement = { };
        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId

        context.callbackWaitsForEmptyEventLoop = false;

        const resp = await Category.findAll({
            where: whereStatement,
            order: [['name', 'ASC']],
        })

        const respFormated = resp.map(item => ({
            ...item,
            value: item.id,
            label: item.name,
        }));
        return handlerResponse(200, respFormated)
    } catch (err) {
        return await handlerErrResponse(err)
    }
};