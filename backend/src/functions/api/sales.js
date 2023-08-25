"use strict";

const { Op } = require('sequelize');
const db = require('../../database');
const { startOfDay, endOfDay, parseISO } = require('date-fns');
const Sale = require('../../models/Sale')(db.sequelize, db.Sequelize);
const User = require('../../models/User')(db.sequelize, db.Sequelize);
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const SaleProduct = require('../../models/SaleProduct')(db.sequelize, db.Sequelize);
const Product = require('../../models/Product')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { executeSelect, executeDelete, executeUpdate } = require("../../services/ExecuteQueryService");

const { roules, userType } = require("../../utils/defaultValues");

const RESOURCE_NAME = 'Venda'

module.exports.list = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const whereStatement = {};
        const whereStatementUser = {};
        const whereStatementClient = {};

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.sales))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')
        const isAdm = checkRouleProfileAccess(user.groups, roules.administrator)
        if (!isAdm)
            whereStatement.companyId = user.companyId
        if (event.queryStringParameters) {
            const { id, product, userName, clientName, valueMin, valueMax, createdAtStart, createdAtEnd, note } = event.queryStringParameters

            if (id) whereStatement.id = id;

            if (product)
                whereStatement.products = { [Op.like]: `%${product}%` }
            if (userName)
                whereStatementUser.name = { [Op.like]: `%${userName}%` }
            if (clientName)
                whereStatementClient.name = { [Op.like]: `%${clientName}%` }
            if (note)
                whereStatement.note = { [Op.like]: `%${note}%` }

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
        let { count, rows } = await Sale.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * pageSize,
            order: [['id', 'DESC']],
            include: [{
                model: User, as: 'user', attributes: ['name'], where: whereStatementUser
            }, {
                model: User, as: 'client',
                attributes: ['name'],
                where: whereStatementClient,
                required: whereStatementClient.name ? true : false
            }, {
                model: Company, as: 'company', attributes: ['name', 'image'],
            }]
        })
        const salesIds = rows.map(x => x.id)
        const salesProductsList = await SaleProduct.findAll({
            where: { saleId: { [Op.in]: salesIds } },
            attributes: ['amount', 'valueAmount', 'value', 'productId', 'saleId'],
            include: [{ model: Product, as: 'product', attributes: ['name', 'price', 'size'] }],
        })
        const newRows = rows.map(s => {
            const productsSales = salesProductsList.filter(sp => sp.saleId === s.id)
            return { ...s.dataValues, productsSales: productsSales.map(x => x.dataValues) }
        })
        const commission = await getCommision(pageSize, isAdm, user.companyId);

        return handlerResponse(200, { count, rows: newRows, commission })

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
                    model: User,
                    as: 'client',
                    attributes: ['name'],
                },
                {
                    model: Company,
                    as: 'company',
                    attributes: ['name'],
                },
                {
                    model: SaleProduct,
                    as: 'productsSales',
                    attributes: ['id', 'amount', 'valueAmount', 'value', 'productId'],
                    include: [{ model: Product, as: 'product', attributes: ['name', 'price'] }]
                },]
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

        if (!checkRouleProfileAccess(user.groups, roules.sales))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const value = body.productsSales.reduce(function (acc, p) { return acc + Number(p.valueAmount); }, 0);
        const objOnSave = {
            ...body,
            userId: user.userId,
            value,
        }
        if (!objOnSave.companyId)
            objOnSave.companyId = user.companyId

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            objOnSave.companyId = user.companyId

        if (checkRouleProfileAccess(user.groups, roules.saleUserIdChange) && body.userId)
            objOnSave.userId = body.userId;

        const result = await Sale.create(objOnSave);

        await createProductsSales(body, result, false);

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

        if (!checkRouleProfileAccess(user.groups, roules.sales))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = body
        const item = await Sale.findByPk(Number(id))

        console.log('BODY ', body)
        console.log('VENDA ALTERADA DE ', item.dataValues)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada`)

        const value = body.productsSales.reduce(function (acc, p) { return acc + Number(p.valueAmount); }, 0);
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

        await createProductsSales(body, result, true);

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

        if (!checkRouleProfileAccess(user.groups, roules.sales))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = pathParameters
        const item = await Sale.findByPk(id)
        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        await Sale.destroy({ where: { id } });
        return handlerResponse(200, {}, `${RESOURCE_NAME} código (${id}) removido com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
    }
}

const getCommision = async (pageSize, isAdm, companyId) => {
    let commission = 0;
    if (Number(pageSize) === 1000) {
        const query = `SELECT SUM(u.commissionMonth) total FROM users u WHERE u.type =  '${userType.USER}' AND u.commissionMonth > 0 ${isAdm ? '' : `AND u.companyId = '${companyId}'`}`
        const [queryResult] = await executeSelect(query);
        commission = Number(queryResult.total)
    }
    return commission
}

const createProductsSales = async (body, result, isDelete) => {
    const { companyId, id } = result
    if (isDelete)
        await executeDelete(`DELETE FROM saleProducts WHERE saleId = ${id} AND companyId = '${companyId}'`);

    const list = body.productsSales.map(ps => ({
        companyId,
        saleId: id,
        productId: ps.productId,
        value: ps.value,
        valueAmount: ps.valueAmount,
        amount: ps.amount,
    }))
    await SaleProduct.bulkCreate(list);

    if (!isDelete) {
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            const query = ` UPDATE products 
                                SET inventoryCount = inventoryCount - ${element.amount}, updatedAt = NOW() 
                            WHERE companyId = '${companyId}' AND id =  ${element.productId}`;
            await executeUpdate(query);
        }
    }
}
