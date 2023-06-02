"use strict";

const { Op } = require('sequelize');
const db = require('../../database');
const Wine = require('../../models/Wine')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { sendMessage } = require('../../services/AwsQueueService')
const { roules } = require("../../utils/defaultValues");

const RESOURCE_NAME = 'Vinho'

module.exports.list = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        let whereStatement = {};

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.wines))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')
        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId
        if (event.queryStringParameters) {
            const { id, productName, producer, wineName, active, priceMin, priceMax, inventoryCountMin, inventoryCountMax, winesWarnig } = event.queryStringParameters

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

            if (inventoryCountMin)
                whereStatement.inventoryCount = {
                    [Op.gte]: Number(inventoryCountMin),
                };
            if (inventoryCountMax)
                whereStatement.inventoryCount = {
                    [Op.lte]: Number(inventoryCountMax),
                };
            if (inventoryCountMin && inventoryCountMax)
                whereStatement.inventoryCount = {
                    [Op.between]: [
                        Number(inventoryCountMin),
                        Number(inventoryCountMax),
                    ],
                };
            if (winesWarnig) {
                whereStatement = {
                    ...whereStatement,
                    active: true,
                    [Op.or]: {
                        inventoryCount: { [Op.lt]: 1 },
                        bottleQuantity: { [Op.lt]: 1 }
                    }
                };
            }
        }

        const { pageSize, pageNumber, winesWarnig } = event.queryStringParameters
        const { count, rows } = await Wine.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * pageSize,
            order: [[winesWarnig ? 'updatedAt' : 'id', 'DESC']],
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
        if (!checkRouleProfileAccess(user.groups, roules.wines))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const result = await Wine.findByPk(pathParameters.id)
        if (!result)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrado`)
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

        if (!checkRouleProfileAccess(user.groups, roules.wines))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = body
        const objOnSave = { id: Number(id), ...body }
        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            objOnSave.companyId = user.companyId

        const result = await Wine.create(objOnSave);

        await sendMessageWineFiles(user, result.dataValues, 'INSERT')

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

        if (!checkRouleProfileAccess(user.groups, roules.wines))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = body
        const item = await Wine.findByPk(Number(id))

        console.log('BODY ', body)
        console.log('PRODUTO ALTERADO DE ', item.dataValues)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrado`)

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        const result = await item.update(body);
        console.log('PARA ', result.dataValues)

        await sendMessageWineFiles(user, result.dataValues, 'UPDATE')

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

        if (!checkRouleProfileAccess(user.groups, roules.wines))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = pathParameters
        const item = await Wine.findByPk(id)
        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        await Wine.destroy({ where: { id } });

        await sendMessageWineFiles(user, item, 'DELETE')

        return handlerResponse(200, {}, `${RESOURCE_NAME} código (${id}) removido com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
    }

}
const sendMessageWineFiles = async (user, wine, type) => {
    await sendMessage('wines-xml-generate-files-queue', {
        companyId: user.companyId,
        userId: user.userId,
        wine,
        type
    });
}