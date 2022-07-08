"use strict";

const { cognitoRequest } = require("../services/AwsCognitoService");
const { handlerResponse, handlerErrResponse } = require("../utils/handleResponse");

module.exports.listUserGroups = async (event) => {
    try {
        const result = await cognitoRequest('listGroups');
        const groups = result ? result.Groups : []
        const data = groups.map((g, index) => ({ key: index, value: g.GroupName, label: g.GroupName, description: g.Description }))

        return handlerResponse(200, data)
    } catch (err) {
        return handlerErrResponse(err)
    }
}