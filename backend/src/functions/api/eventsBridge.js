"use strict";

const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { roules } = require("../../utils/defaultValues");

const AWS = require('aws-sdk')
AWS.config.update({
    region: process.env.REGION
})

const eventbridge = new AWS.EventBridge({ apiVersion: '2015-10-07' });

const RESOURCE_NAME = 'Configurações'

module.exports.get = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const prefix = process.env.SERVICE_NAME.includes('prod') ? process.env.SERVICE_NAME.replace('prod', 'pro') : process.env.SERVICE_NAME
        const params = { NamePrefix: prefix }
        const result = await eventbridge.listRules(params).promise();

        return handlerResponse(200, result)
    } catch (err) {
        return await handlerErrResponse(err)
    }
};

module.exports.update = async (event) => {
    const body = JSON.parse(event.body)
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade');

        const { Name, State, ScheduleExpression } = body;

        const params = { Name, State, ScheduleExpression }
        const result = await eventbridge.putRule(params).promise()

        return handlerResponse(201, result, `${RESOURCE_NAME} alteradas com sucesso`);
    } catch (err) {
        return await handlerErrResponse(err, body)
    }
}