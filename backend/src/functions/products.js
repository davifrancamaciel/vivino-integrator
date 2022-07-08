"use strict";

const AWS = require("aws-sdk");
const { handlerResponse, handlerErrResponse } = require("../utils/handleResponse");
const { getUser } = require("../services/UserService");

const RESOURCE_NAME = 'Vinho'

const dynamodbOfflineOptions = {
    region: "localhost",
    endpoint: "http://localhost:8000",
};

const isOffline = () => process.env.IS_OFFLINE;

const dynamodb = new AWS.DynamoDB.DocumentClient();
// const dynamodb = isOffline()
//     ? new AWS.DynamoDB.DocumentClient(dynamodbOfflineOptions)
//     : new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: process.env.PRODUCTS_TABLE,
};

module.exports.list = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const whereStatement = {};

        if (event.queryStringParameters) {
            const { id, name, objective, briefing, requester, active } = event.queryStringParameters

            if (id) whereStatement.id = id;

            if (name)
                whereStatement.name = { [Op.like]: `%${name}%` }
            if (objective)
                whereStatement.objective = { [Op.like]: `%${objective}%` }
            if (briefing)
                whereStatement.briefing = { [Op.like]: `%${briefing}%` }
            if (requester)
                whereStatement.requester = { [Op.like]: `%${requester}%` }
            if (active !== undefined)
                whereStatement.active = active === 'true';

        }
        
        const queryString = {
            limit: 5,
            ...event.queryStringParameters,
        };
        const { limit, next } = queryString;

        let localParams = {
            ...params,
            Limit: limit,
        };
        if (next) {
            localParams.ExclusiveStartKey = {
                //usuario_id: usuario_id,
                product_id: next,
            };
        }
        let data = await dynamodb.scan(localParams).promise();

        let nextToken =
            data.LastEvaluatedKey != undefined
                ? data.LastEvaluatedKey.product_id
                : null;

        const result = {
            items: data.Items,
            next_token: nextToken,
        };

        // const { count, rows } = await Products.findAndCountAll({
        //     where: whereStatement,
        //     limit: Number(pageSize) || 10,
        //     offset: (Number(pageNumber) - 1) * 10,
        //     order: [['id', 'DESC']],
        // })

        return handlerResponse(200, { count: 0, rows: [], result })

    } catch (err) {
        return handlerErrResponse(err)
    }
};

module.exports.listById = async (event) => {
    const { pathParameters } = event
    try {
        const result = await dynamodb
            .get({
                ...params,
                Key: {
                    product_id: pathParameters.id,
                },
            })
            .promise();

        if (!result)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrado`)

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

        if (!user.havePermissionApprover)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const timestamp = new Date().getTime();

        const { product_id, name } = body

        const product = {
            product_id:'1',
            name,
            status: true,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        const result = await dynamodb.put({ ...params, Item: product }).promise();
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
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!user.havePermissionApprover)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id, name } = body
        const timestamp = new Date().getTime();
        const result = await dynamodb
            .update({
                ...params,
                Key: {
                    product_id: id,
                },
                UpdateExpression:
                    "SET name = :name, updatedAt = :updatedAt",
                ConditionExpression: "attribute_exists(product_id)",
                ExpressionAttributeValues: {
                    ":name": name,
                    ":updatedAt": timestamp,
                },
            })
            .promise();
        return handlerResponse(204, result, `${RESOURCE_NAME} alterado com sucesso`)
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

        if (!user.havePermissionApprover)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = pathParameters

        await dynamodb
            .delete({
                ...params,
                Key: {
                    product_id: id,
                },
                ConditionExpression: "attribute_exists(product_id)",
            })
            .promise();
        return handlerResponse(200, {}, `${RESOURCE_NAME} código (${id}) removido com sucesso`)
    } catch (err) {
        return handlerErrResponse(err, pathParameters)
    }
}

module.exports.listAll = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const whereStatement = {};

        if (event.queryStringParameters) {
            const { active } = event.queryStringParameters
            if (active !== undefined)
                whereStatement.active = active === 'true';
        }

        // const resp = await Products.findAll({
        //     where: whereStatement,
        //     attributes: ['id', 'name'],
        //     order: [['name', 'ASC']],
        // })

        // const respFormated = resp.map(item => ({
        //     value: item.id,
        //     label: `(${item.id}) ${item.name}`,
        // }));
        // return handlerResponse(200, respFormated)
    } catch (err) {
        return handlerErrResponse(err)
    }
};