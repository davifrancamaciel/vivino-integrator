"use strict";

const generateHash = require("../utils/generateHash");
const { cognitoRequest } = require("../services/AwsCognitoService");
const { handlerResponse, handlerErrResponse } = require("../utils/handleResponse");
const { findUserById, getUser, checkRouleProfileAccess } = require('../services/UserService')
const { roules, cognito } = require("../utils/defaultValues");

const RESOURCE_NAME = 'Usuário'

module.exports.list = async (event) => {
    const { queryStringParameters } = event
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.users))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const qsp = queryStringParameters;
        const params = {
            Limit: qsp && qsp.limit ? qsp.limit : 10,
            Filter: qsp && qsp.name ? `name ^= "${qsp.name}"` : undefined,
        }
        const result = await cognitoRequest(cognito.listUsers, params);

        return handlerResponse(200, result)
    } catch (err) {
        return handlerErrResponse(err, queryStringParameters)
    }
}

module.exports.listById = async (event) => {
    const { pathParameters } = event
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.users))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const item = await findUserById(pathParameters.id)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrado`)

        const { Username } = item
        const resp = await cognitoRequest(cognito.adminListGroupsForUser, { Username })
        const Groups = resp.Groups.map(g => (g.GroupName))

        return handlerResponse(200, { ...item, Groups })
    } catch (err) {
        return handlerErrResponse(err, pathParameters)
    }
}

module.exports.create = async (event) => {

    const body = JSON.parse(event.body)
    const { password, email, name, status, login, accessType } = body;
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.users))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const request = {
            Username: login,
            TemporaryPassword: password ? password : generateHash(),
            //MessageAction: 'SUPPRESS',//'RESEND',
            UserAttributes: [
                { Name: 'name', Value: name ? name : login },
                { Name: 'email', Value: email },
                { Name: 'custom:type_access', Value: !!accessType ? accessType.join(', ') : '' },
                { Name: 'email_verified', Value: 'true' },
            ],
        }

        const result = await cognitoRequest(cognito.adminCreateUser, request);

        if (!!accessType) await addUserToGroup(login, accessType, 0)

        if (!status) await cognitoRequest(cognito.adminDisableUser, { Username: login });

        return handlerResponse(201, result, `${RESOURCE_NAME} ${name} criado com sucesso`)
    } catch (err) {
        return handlerErrResponse(err, body)
    }
}

module.exports.update = async (event) => {
    const body = JSON.parse(event.body)
    const { resetPassword, password, name, status, login, accessType } = body;
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.users))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const groups = await cognitoRequest(cognito.adminListGroupsForUser, { Username: login })
        if (groups.Groups.length) {
            const groupsUser = groups.Groups.map((group) => (group.GroupName))

            const groupsUserRemove = groupsUser.filter(element => {
                if (!accessType.find(x => x === element)) return element
            });
            await removeUserToGroup(login, groupsUserRemove, 0)

            if (!!accessType) {
                const groupsUserAdd = accessType.filter(element => {
                    if (!groupsUser.find(x => x === element)) return element
                });
                await addUserToGroup(login, groupsUserAdd, 0)
            }
        }
        else {
            if (!!accessType) await addUserToGroup(login, accessType, 0)
        }

        const request = {
            Username: login,
            UserAttributes: [
                { Name: 'name', Value: name ? name : login },
                { Name: 'custom:type_access', Value: !!accessType ? accessType.join(', ') : '' },
            ],
        }

        const result = await cognitoRequest(cognito.adminUpdateUserAttributes, request);

        const methodStatus = status ? cognito.adminEnableUser : cognito.adminDisableUser
        await cognitoRequest(methodStatus, { Username: login });

        if (resetPassword && password)
            await cognitoRequest(cognito.adminSetUserPassword, { Username: login, Password: password, Permanent: true });

        return handlerResponse(200, result, `${RESOURCE_NAME} ${name} alterado com sucesso`)
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

        if (!checkRouleProfileAccess(user.groups, roules.users))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade');

        if (user.sub === pathParameters.id)
            return handlerResponse(400, {}, `Você não pode remover sua própria conta. Somente outro usuário com acesso poderá realizar esta ação.`)

        const item = await findUserById(pathParameters.id)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrado`)

        const { Username } = item
        const resultDelete = await cognitoRequest(cognito.adminDeleteUser, { Username });

        return handlerResponse(200, resultDelete, `${RESOURCE_NAME} ${Username} removido com sucesso`)
    } catch (err) {
        return handlerErrResponse(err, pathParameters)
    }
}

const addUserToGroup = async (Username, groups, position) => {
    if (!!groups.length) await cognitoRequest(cognito.adminAddUserToGroup, { GroupName: groups[position], Username })

    position = position + 1
    if (groups.length > position) return await addUserToGroup(Username, groups, position)

    return true
}

const removeUserToGroup = async (Username, groups, position) => {
    if (!!groups.length) await cognitoRequest(cognito.adminRemoveUserFromGroup, { GroupName: groups[position], Username })

    position = position + 1
    if (groups.length > position) return await removeUserToGroup(Username, groups, position)

    return true
}