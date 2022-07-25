"use strict";

const { handlerResponse, handlerErrResponse } = require("../utils/handleResponse");
const { getUser } = require("../services/UserService");
const { executeSelect } = require("../services/ExecuteQueryService");

module.exports.productsByStatus = async (event, context) => {
    try {
        const { pathParameters } = event;
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        const query = `SELECT COUNT(id) count FROM products WHERE active = ${pathParameters.active}`
        const [result] = await executeSelect(query);

        return handlerResponse(200, result)
    } catch (err) {
        return handlerErrResponse(err)
    }
};