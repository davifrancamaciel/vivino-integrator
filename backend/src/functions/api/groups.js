"use strict";

const db = require('../../database');
const { cognitoRequest } = require("../../services/AwsCognitoService");
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { roules } = require("../../utils/defaultValues");
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);

module.exports.listUserGroups = async (event) => {
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.users))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const result = await cognitoRequest('listGroups');
        const groups = result ? result.Groups : []
        let data = groups.map((g, index) => ({
            key: index,
            value: g.GroupName,
            label: g.GroupName,
            description: g.Description
        }))

        if (!checkRouleProfileAccess(user.groups, roules.administrator)) {
            const company = await Company.findByPk(user.companyId)
            data = data.map((g) => {
                const groupsFormatted = company.groups ? JSON.parse(company.groups) : []
                const isAvalable = groupsFormatted.find(x => x === g.value)
                if (isAvalable)
                    return g
            })
            data = data.filter(x => x !== undefined)
        }
        return handlerResponse(200, data)
    } catch (err) {
        return handlerErrResponse(err)
    }
}