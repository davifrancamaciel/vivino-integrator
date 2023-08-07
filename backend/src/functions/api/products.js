"use strict";

const { Op } = require('sequelize');
const db = require('../../database');
const Product = require('../../models/Product')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { executeSelect } = require("../../services/ExecuteQueryService");
const { roules } = require("../../utils/defaultValues");
const formatPrice = require("../../utils/formatPrice");
const imageService = require("../../services/ImageService");

const RESOURCE_NAME = 'Produto'

module.exports.list = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        let whereStatement = {};

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.products))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')
        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId
        if (event.queryStringParameters) {
            const { id, name, active, priceMin, priceMax, inventoryCountMin, inventoryCountMax } = event.queryStringParameters

            if (id) whereStatement.id = id;

            if (name)
                whereStatement.name = { [Op.like]: `%${name}%` }
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
        }

        const { pageSize, pageNumber } = event.queryStringParameters
        const { count, rows } = await Product.findAndCountAll({
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

module.exports.listById = async (event) => {
    const { pathParameters } = event
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.products))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const result = await Product.findByPk(pathParameters.id)
        if (!result)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrado`)
        if (!checkRouleProfileAccess(user.groups, roules.administrator) && result.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        const query = ` SELECT SUM(amount) totalSaled FROM saleProducts WHERE productId = ${pathParameters.id}`
        const [resultSale] = await executeSelect(query);

        return handlerResponse(200, { ...result?.dataValues, ...resultSale })
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

        if (!checkRouleProfileAccess(user.groups, roules.products))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = body
        const objOnSave = { id: Number(id), ...body }
        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            objOnSave.companyId = user.companyId

        const result = await Product.create(objOnSave);
        
        await imageService.add('products', result.dataValues, body.fileList);

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

        if (!checkRouleProfileAccess(user.groups, roules.products))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = body
        const item = await Product.findByPk(Number(id))

        console.log('BODY ', body)
        console.log('PRODUTO ALTERADO DE ', item.dataValues)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrado`)

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        const result = await item.update(body);
        console.log('PARA ', result.dataValues)

        await imageService.add('products', result.dataValues, body.fileList);

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

        if (!checkRouleProfileAccess(user.groups, roules.products))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = pathParameters
        const item = await Product.findByPk(id)
        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        await Product.destroy({ where: { id } });

        await imageService.remove(item.image);

        return handlerResponse(200, {}, `${RESOURCE_NAME} código (${id}) removido com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
    }

}

module.exports.listAll = async (event, context) => {
    try {
        const { queryStringParameters } = event
        let whereStatement = {};
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.sales))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')
        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId

        if (queryStringParameters) {
            const { active } = queryStringParameters

            if (active !== undefined && active !== '')
                whereStatement.active = active === 'true';
        }

        const resp = await Product.findAll({
            order: [['name', 'ASC']],
            where: whereStatement,
        })

        const respFormated = resp.map(item => ({
            ...item.dataValues,
            value: item.id,
            label: `${item.name} ${item.size || ''} ${item.color || ''} ${formatPrice(item.price)} COD (${item.id})`,
        }));
        return handlerResponse(200, respFormated)
    } catch (err) {
        return await handlerErrResponse(err)
    }
};