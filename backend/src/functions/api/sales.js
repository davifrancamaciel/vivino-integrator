"use strict";

const { Op } = require('sequelize');
const db = require('../../database');
const { startOfDay, endOfDay, parseISO } = require('date-fns');
const Sale = require('../../models/Sale')(db.sequelize, db.Sequelize);
const User = require('../../models/User')(db.sequelize, db.Sequelize);
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { executeSelect } = require("../../services/ExecuteQueryService");

const { roules } = require("../../utils/defaultValues");

const RESOURCE_NAME = 'Venda'

module.exports.list = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const whereStatement = {};
        const whereStatementUser = {};

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.sales))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')
        const isAdm = checkRouleProfileAccess(user.groups, roules.administrator)
        if (!isAdm)
            whereStatement.companyId = user.companyId
        if (event.queryStringParameters) {
            const { id, product, userName, valueMin, valueMax, createdAtStart, createdAtEnd } = event.queryStringParameters

            if (id) whereStatement.id = id;

            if (product)
                whereStatement.products = { [Op.like]: `%${product}%` }
            if (userName)
                whereStatementUser.name = { [Op.like]: `%${userName}%` }

            if (valueMin)
                whereStatement.value = {
                    [Op.gte]: Number(valueMin),
                };
            if (valueMax)
                whereStatement.value = {
                    [Op.lte]: Number(valueMax),
                };
            if (valueMin && valueMax)
                whereStatement.value = {
                    [Op.between]: [
                        Number(valueMin),
                        Number(valueMax),
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
        }

        const { pageSize, pageNumber } = event.queryStringParameters
        const { count, rows } = await Sale.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * pageSize,
            order: [['id', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['name'],
                    where: whereStatementUser
                },
                {
                    model: Company,
                    as: 'company',
                    attributes: ['name'],
                }]
        })

        const commission = await getCommision(pageSize, isAdm, user.companyId);

        return handlerResponse(200, { count, rows, commission })

    } catch (err) {
        return handlerErrResponse(err)
    }
};

module.exports.listById = async (event) => {
    const { pathParameters } = event
    try {
        const user = await getUser(event)
        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.sales))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const result = await Sale.findByPk(pathParameters.id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['name'],
                },
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
        return handlerErrResponse(err, pathParameters)
    }
}

module.exports.create = async (event) => {
    const body = JSON.parse(event.body)
    try {

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.sales))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const products = JSON.parse(body.products)
        const value = products.reduce(function (acc, p) { return acc + p.value; }, 0);
        const objOnSave = {
            ...body,
            userId: user.userId,
            value,
        }
        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            objOnSave.companyId = user.companyId

        if (checkRouleProfileAccess(user.groups, roules.saleUserIdChange) && body.userId)
            objOnSave.userId = body.userId;

        const result = await Sale.create(objOnSave);
        return handlerResponse(201, result, `${RESOURCE_NAME} criada com sucesso`)
    } catch (err) {
        return handlerErrResponse(err, body)
    }
}

module.exports.update = async (event) => {
    const body = JSON.parse(event.body)
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.sales))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = body
        const item = await Sale.findByPk(Number(id))

        console.log('BODY ', body)
        console.log('VENDA ALTERADA DE ', item.dataValues)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada`)

        const products = JSON.parse(body.products)
        const value = products.reduce(function (acc, p) { return acc + p.value; }, 0);
        const objOnSave = {
            ...body,
            value,
            userId: user.userId,
        }
        if (checkRouleProfileAccess(user.groups, roules.saleUserIdChange) && body.userId)
            objOnSave.userId = body.userId;

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        if (!checkRouleProfileAccess(user.groups, roules.saleUserIdChange) && item.userId !== user.userId)
            return handlerResponse(403, {}, 'Usuário não tem permissão alterar esta venda');

        if (!checkRouleProfileAccess(user.groups, roules.saleUserIdChange))
            objOnSave.userId = body.userId;

        const result = await item.update(objOnSave);
        console.log('PARA ', result.dataValues)

        return handlerResponse(200, result, `${RESOURCE_NAME} alterada com sucesso`)
    } catch (err) {
        return handlerErrResponse(err, body)
    }
}

module.exports.delete = async (event) => {
    const { pathParameters } = event
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.sales))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = pathParameters
        const item = await Sale.findByPk(id)
        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        await Sale.destroy({ where: { id } });
        return handlerResponse(200, {}, `${RESOURCE_NAME} código (${id}) removido com sucesso`)
    } catch (err) {
        return handlerErrResponse(err, pathParameters)
    }
}

const getCommision = async (pageSize, isAdm, companyId) => {
    let commission = 0;
    if (Number(pageSize) === 1000) {
        const query = `SELECT SUM(u.commissionMonth) total FROM users u WHERE u.commissionMonth > 0 ${isAdm ? '' : `AND u.companyId = '${companyId}'`}`
        const [queryResult] = await executeSelect(query);
        commission = Number(queryResult.total)
    }
    return commission
}

// const resp = await listProducts()
// return handlerResponse(200, resp)

const listProducts = async () => {
    const result = await Sale.findAll({
        attibutes: ['productsFormatted'],
        where: { userId: { [Op.in]: ['7eaed82d-72e2-40c6-9de9-117f324f5530', '623be749-c4d7-4987-bb3d-5bdd1d810223'] } }
    })
    let list = []
    result.map(s => s.productsFormatted.map(p => list.push(formatProduct(p))))
    const distinctProducts = distinctValues(list, 'name')
    return order(distinctProducts, 'name')
}

const capitalize = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
}

const formatProduct = (p) => {
    let name = p.name.trim();

    if (p.name.includes('1 '))
        return { ...p, name, newName: capitalize(name.replace('1 ', '')) }
    if (p.name.includes('2 '))
        return { ...p, name, newName: capitalize(name.replace('2 ', '')), newValue: p.value / 2, }
    if (p.name.includes('3 '))
        return { ...p, name, newName: capitalize(name.replace('3 ', '')), newValue: p.value / 3, }
    if (p.name.includes('4 '))
        return { ...p, name, newName: capitalize(name.replace('4 ', '')), newValue: p.value / 4, }
    if (p.name.includes('5 '))
        return { ...p, name, newName: capitalize(name.replace('5 ', '')), newValue: p.value / 5, }
    if (p.name.includes('6 '))
        return { ...p, name, newName: capitalize(name.replace('6 ', '')), newValue: p.value / 6, }
    if (p.name.includes('7 '))
        return { ...p, name, newName: capitalize(name.replace('7 ', '')), newValue: p.value / 7, }
    if (p.name.includes('8 '))
        return { ...p, name, newName: capitalize(name.replace('8 ', '')), newValue: p.value / 8, }

    return { ...p, name }
}


const distinctValues = (data, key) => {
    return data.filter(
        (o, i, arr) => arr.findIndex((t) => t[key] === o[key]) === i
    );
};

const order = (data, key) => {
    return data.sort(function (a, b) {
        if (a[key] > b[key]) {
            return 1;
        }
        if (a[key] < b[key]) {
            return -1;
        }
        return 0;
    });
};