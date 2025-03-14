"use strict";

const { Op } = require('sequelize');
const { startOfDay, endOfDay, parseISO } = require('date-fns');
const db = require('../../database');
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { roules } = require("../../utils/defaultValues");
const imageService = require("../../services/ImageService");
const s3 = require("../../services/AwsS3Service");
const { executeSelect } = require("../../services/ExecuteQueryService");


const RESOURCE_NAME = 'Empresa'

module.exports.list = async (event, context) => {
    try {

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        context.callbackWaitsForEmptyEventLoop = false;

        const whereStatement = {};

        if (event.queryStringParameters) {
            const {
                id, name, createdAtStart, createdAtEnd } = event.queryStringParameters

            if (id) whereStatement.id = id;

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

        const { pageSize, pageNumber } = event.queryStringParameters
        const { count, rows } = await Company.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * Number(pageSize),
            order: [['createdAt', 'DESC']],
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

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const result = await Company.findByPk(pathParameters.id)
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

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')
        const objOnSave = body

        if (body.groupsFormatted)
            objOnSave.groups = JSON.stringify(body.groupsFormatted)

        const result = await Company.create(objOnSave);

        await imageService.add('companies', result.dataValues, body.fileList);
        await imageService.add('companies', result.dataValues, body.bannerList, 'banner');
        await createFile(result.dataValues);

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

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = body
        const item = await Company.findByPk(id)

        console.log('BODY ', body)
        console.log('ALTERADO DE ', item.dataValues)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrado`)

        const objOnSave = body
        if (body.groupsFormatted)
            objOnSave.groups = JSON.stringify(body.groupsFormatted)

        const result = await item.update(objOnSave);
        console.log('PARA ', result.dataValues)
        await imageService.add('companies', result.dataValues, body.fileList);
        await imageService.add('companies', result.dataValues, body.bannerList, 'banner');
        await createFile(result.dataValues);

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

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = pathParameters;

        const item = await Company.findByPk(id);

        await imageService.remove(item.image);
        await imageService.remove(item.banner);

        await Company.destroy({ where: { id } });

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

        if (!checkRouleProfileAccess(user.groups, roules.users))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        context.callbackWaitsForEmptyEventLoop = false;

        const resp = await Company.findAll({
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

module.exports.listByName = async (event) => {
    const { pathParameters } = event
    try {

        const query = `SELECT name, id, image, phone, pixKey, open, banner FROM companies WHERE active = true AND REPLACE(LOWER(name), ' ','') = '${pathParameters.name}';`
        const [result] = await executeSelect(query)
        if (!result)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada`)

        return handlerResponse(200, result)
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
    }
}

const createFile = async (company) => {
    const key = `${company.id}/_company_${company.name}.json`;
    const { bucketPublicName } = process.env
    await s3.put(JSON.stringify({ id: company.id, name: company.name }), key, bucketPublicName);
}