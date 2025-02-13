"use strict";

const { Op } = require('sequelize');
const { startOfDay, endOfDay, parseISO } = require('date-fns');
const db = require('../../database');
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const ShippingCompany = require('../../models/ShippingCompany')(db.sequelize, db.Sequelize);
const Romanian = require('../../models/Romanian')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const romanianService = require("../../services/RomanianService");
const { roules } = require("../../utils/defaultValues");

const RESOURCE_NAME = 'Romaneio'

module.exports.list = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const whereStatement = {};
        const whereStatementCompany = {};
        const whereStatementShippingCompany = {}

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.romanians))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')
        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId

        if (event.queryStringParameters) {
            const {
                id, companyName, noteNumber, clientName, shippingCompanyName, trackingCode,
                saleDateAtStart, saleDateAtEnd, originSale, delivered, sended
            } = event.queryStringParameters

            if (id) whereStatement.id = id;

            if (companyName)
                whereStatementCompany.name = { [Op.like]: `%${companyName}%` }
            if (noteNumber)
                whereStatement.noteNumber = { [Op.like]: `%${noteNumber}%` }
            if (clientName)
                whereStatement.clientName = { [Op.like]: `%${clientName}%` }
            if (shippingCompanyName)
                whereStatementShippingCompany.name = { [Op.like]: `%${shippingCompanyName}%` }

            if (delivered !== undefined && delivered !== '')
                whereStatement.delivered = delivered === 'true';
            if (sended !== undefined && sended !== '')
                whereStatement.sended = sended === 'true';
            if (originSale)
                whereStatement.originSale = { [Op.like]: `%${originSale}%` }

            if (trackingCode)
                whereStatement.trackingCode = { [Op.like]: `%${trackingCode}%` }

            if (saleDateAtStart)
                whereStatement.saleDateAt = {
                    [Op.gte]: startOfDay(parseISO(saleDateAtStart)),
                };

            if (saleDateAtEnd)
                whereStatement.saleDateAt = {
                    [Op.lte]: endOfDay(parseISO(saleDateAtEnd)),
                };
            if (saleDateAtStart && saleDateAtEnd)
                whereStatement.saleDateAt = {
                    [Op.between]: [
                        startOfDay(parseISO(saleDateAtStart)),
                        endOfDay(parseISO(saleDateAtEnd)),
                    ],
                };
        }

        const { pageSize, pageNumber } = event.queryStringParameters
        const { count, rows } = await Romanian.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * Number(pageSize),
            order: [['id', 'DESC']],
            include: [
                {
                    model: Company,
                    as: 'company',
                    attributes: ['name', 'image'],
                    where: whereStatementCompany
                },
                {
                    model: ShippingCompany,
                    as: 'shippingCompany',
                    attributes: ['name'],
                    where: whereStatementShippingCompany
                }]
        })

        return handlerResponse(200, { count, rows })

    } catch (err) {
        return await handlerErrResponse(err)
    }
};

module.exports.listById = async (event) => {
    const user = await getUser(event)

    if (!user)
        return handlerResponse(400, {}, 'Usuário não encontrado')
    if (!checkRouleProfileAccess(user.groups, roules.romanians))
        return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

    const { pathParameters } = event
    try {
        const result = await Romanian.findByPk(pathParameters.id, {
            include: [
                {
                    model: Company,
                    as: 'company',
                    attributes: ['name'],
                },
                {
                    model: ShippingCompany,
                    as: 'shippingCompany',
                    attributes: ['name'],
                }]
        })
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

        if (!checkRouleProfileAccess(user.groups, roules.romanians))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')
        let objOnSave = body
        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            objOnSave.companyId = user.companyId

        const isExist = await romanianService.findOne(objOnSave);
        if (isExist)
            return handlerResponse(403, {}, 'Já existe um romaneio para esta nota');

        objOnSave = validateObjOnSave(objOnSave);
        const result = await Romanian.create(objOnSave);
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

        if (!checkRouleProfileAccess(user.groups, roules.romanians))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = body
        const item = await Romanian.findByPk(Number(id))

        console.log('BODY ', body)
        console.log('ROMANEIO ALTERADO DE ', item.dataValues)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrado`)

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        let objOnSave = body
        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            objOnSave.companyId = user.companyId

        const isExist = await romanianService.findOne(objOnSave);
        if (isExist && isExist.id != item.id)
            return handlerResponse(403, {}, 'Já existe um romaneio para esta nota');

        objOnSave = validateObjOnSave(objOnSave);
        const result = await item.update(objOnSave);
        console.log('PARA ', result.dataValues)

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

        if (!checkRouleProfileAccess(user.groups, roules.romanians))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = pathParameters
        const item = await Romanian.findByPk(id)
        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        await Romanian.destroy({ where: { id } });
        return handlerResponse(200, {}, `${RESOURCE_NAME} código (${id}) removido com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
    }
}

const validateObjOnSave = (objOnSave) => {
    if (objOnSave.delivered && !objOnSave.sended && !objOnSave.saleDateAt) {
        objOnSave.sended = true;
        objOnSave.saleDateAt = new Date();
        return objOnSave;
    }
    if (!objOnSave.delivered && objOnSave.sended && !objOnSave.saleDateAt) {
        objOnSave.saleDateAt = new Date();
        return objOnSave;
    }
    if (!objOnSave.delivered && !objOnSave.sended && objOnSave.saleDateAt) {
        objOnSave.saleDateAt = null;
        return objOnSave;
    }

    if (objOnSave.delivered && !objOnSave.sended && objOnSave.saleDateAt) {
        objOnSave.saleDateAt = null;
        objOnSave.delivered = false
        return objOnSave;
    }
    return objOnSave;
}