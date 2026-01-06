"use strict";

const { Op } = require('sequelize');
const db = require('../../database');
const { startOfDay, endOfDay, parseISO } = require('date-fns');
const generateHash = require("../../utils/generateHash");
const { cognitoRequest } = require("../../services/AwsCognitoService");
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { findUserById, getUser, checkRouleProfileAccess, mapUser } = require('../../services/UserService')
const { roules, cognito, userType } = require("../../utils/defaultValues");
const User = require('../../models/User')(db.sequelize, db.Sequelize);
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const WineSaleUser = require('../../models/WineSaleUser')(db.sequelize, db.Sequelize);
const imageService = require("../../services/ImageService");

const RESOURCE_NAME = 'Usuário'

module.exports.list = async (event) => {
    const { queryStringParameters } = event
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.users) && !checkRouleProfileAccess(user.groups, roules.clients))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const whereStatement = {};
        const whereStatementCompany = {};

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId

        if (queryStringParameters) {
            const { id, companyName, name, type, email, createdAtStart, createdAtEnd } = queryStringParameters

            if (id)
                whereStatement.id = id;
            if (type)
                whereStatement.type = type;
            if (companyName)
                whereStatementCompany.name = { [Op.like]: `%${companyName}%` }
            if (name)
                whereStatement.name = { [Op.like]: `%${name}%` }
            if (email)
                whereStatement.email = { [Op.like]: `%${email}%` }

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

        const { pageSize, pageNumber } = queryStringParameters
        const { count, rows } = await User.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * Number(pageSize),
            order: Number(pageSize) === 500 ? [['name', 'ASC']] : [['id', 'DESC']],
            include: [
                {
                    model: Company,
                    as: 'company',
                    attributes: ['name'],
                    where: whereStatementCompany
                }]
        })

        if (checkRouleProfileAccess(user.groups, roules.wines)) {
            const usersIds = rows.map(x => x.id)
            const wineSaleUsersList = await WineSaleUser.findAll({
                where: { userId: { [Op.in]: usersIds } },
                attributes: ['code', 'userId'],
            })
            const newRows = rows.map(s => {
                const wineSaleUsers = wineSaleUsersList.filter(sp => sp.userId === s.id)
                return { ...s.dataValues, wineSaleUsers: wineSaleUsers.map(x => x.dataValues) }
            });
            return handlerResponse(200, { count, rows: newRows })
        }
        return handlerResponse(200, { count, rows })
    } catch (err) {
        return await handlerErrResponse(err, queryStringParameters)
    }
}

module.exports.listById = async (event) => {
    const { pathParameters } = event
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.users) && !checkRouleProfileAccess(user.groups, roules.clients))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade');

        const userInDb = await User.findByPk(pathParameters.id, {
            // include: [
            //     {
            //         model: Company,
            //         as: 'company',
            //         attributes: ['name'],
            //     }]
        })

        if (!userInDb)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrado`)

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && userInDb.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        const data = userInDb.dataValues;

        if (data.type === userType.USER) {

            const item = await findUserById(userInDb.userAWSId)
            if (!item)
                return handlerResponse(400, {}, `Lodin de ${RESOURCE_NAME} não encontrado`)

            const { Username } = item
            const resp = await cognitoRequest(cognito.adminListGroupsForUser, { Username })
            const Groups = resp.Groups.map(g => (g.GroupName))
            data.UserAws = { ...item, Groups }
        }

        return handlerResponse(200, data)
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
    }
}

module.exports.create = async (event) => {
    let userDbId = 0
    const body = JSON.parse(event.body)
    let { password, email, name, status, accessType, companyId, commissionMonth, phone, type, dayMaturityFavorite } = body;
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.users) && !checkRouleProfileAccess(user.groups, roules.clients))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')
        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            companyId = user.companyId

        if (type === userType.USER) {
            if (password && password.length < 8)
                return handlerResponse(400, {}, `A senha precisa ter ao menos 8 caracteres`)
            const item = await User.findOne({ where: { email } })
            if (item)
                return handlerResponse(400, {}, `${RESOURCE_NAME} já existe`)
        }

        const objOnSave = {
            email,
            name,
            companyId,
            commissionMonth: commissionMonth ? Number(commissionMonth) : 0,
            phone, type, dayMaturityFavorite,
            active: status
        }

        let resultNewUser = await User.create(objOnSave);
        userDbId = resultNewUser.id
        if (type === userType.USER) {
            const request = {
                Username: email,
                TemporaryPassword: password ? password : generateHash(),
                //MessageAction: 'SUPPRESS',//'RESEND',
                UserAttributes: [
                    { Name: 'email', Value: email },
                    { Name: 'email_verified', Value: 'true' },
                    { Name: 'name', Value: name ? name : email },
                    { Name: 'custom:company_id', Value: companyId },
                    { Name: 'custom:user_id', Value: `${userDbId}` },
                ],
            }

            const resultUserAws = await cognitoRequest(cognito.adminCreateUser, request);

            if (!!accessType)
                await addUserToGroup(email, accessType, 0)

            if (!status)
                await cognitoRequest(cognito.adminDisableUser, { Username: email });

            const newUserAws = mapUser(resultUserAws.User)
            const itemUpdate = await User.findByPk(Number(userDbId))
            resultNewUser = await itemUpdate.update({ userAWSId: newUserAws.id });
        }

        await imageService.add('users', resultNewUser.dataValues, body.fileList);

        return handlerResponse(201, resultNewUser, `${RESOURCE_NAME} ${name} criado com sucesso`)
    } catch (err) {
        await cognitoRequest(cognito.adminDeleteUser, { Username: email });
        await User.destroy({ where: { id: userDbId } });
        return await handlerErrResponse(err, body)
    }
}

module.exports.update = async (event) => {
    const body = JSON.parse(event.body)
    let { resetPassword, password, name, status, accessType, companyId, type } = body;
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.users) && !checkRouleProfileAccess(user.groups, roules.clients))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            companyId = user.companyId

        const { id } = body
        const item = await User.findByPk(Number(id))

        console.log('BODY ', body)
        console.log('ALTERADO DE ', item.dataValues)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrado`)

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        const resultUserDb = await item.update({ ...body, active: status });
        console.log('PARA ', resultUserDb.dataValues)
        if (type === userType.USER) {
            const groups = await cognitoRequest(cognito.adminListGroupsForUser, { Username: item.email })
            if (groups.Groups.length) {
                const groupsUser = groups.Groups.map((group) => (group.GroupName))

                const groupsUserRemove = groupsUser.filter(element => {
                    if (!accessType.find(x => x === element)) return element
                });
                await removeUserToGroup(item.email, groupsUserRemove, 0)

                if (!!accessType) {
                    const groupsUserAdd = accessType.filter(element => {
                        if (!groupsUser.find(x => x === element)) return element
                    });
                    await addUserToGroup(item.email, groupsUserAdd, 0)
                }
            }
            else {
                if (!!accessType) await addUserToGroup(item.email, accessType, 0)
            }

            const request = {
                Username: item.email,
                UserAttributes: [
                    { Name: 'name', Value: name ? name : item.email },
                    { Name: 'custom:company_id', Value: companyId },
                    { Name: 'custom:user_id', Value: `${id}` },
                ],
            }

            const result = await cognitoRequest(cognito.adminUpdateUserAttributes, request);

            const methodStatus = status ? cognito.adminEnableUser : cognito.adminDisableUser
            await cognitoRequest(methodStatus, { Username: item.email });

            if (resetPassword && password)
                await cognitoRequest(cognito.adminSetUserPassword, { Username: item.email, Password: password, Permanent: true });
        }

        await imageService.add('users', resultUserDb.dataValues, body.fileList);

        return handlerResponse(200, resultUserDb, `${RESOURCE_NAME} ${name} alterado com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, body)
    }
}

module.exports.delete = async (event) => {
    const { pathParameters } = event
    try {
        const { id } = pathParameters

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.users) && !checkRouleProfileAccess(user.groups, roules.clients))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade');

        if (Number(user.userId) === Number(id))
            return handlerResponse(400, {}, `Você não pode remover sua própria conta. Somente outro usuário com acesso poderá realizar esta ação.`)

        const userInDb = await User.findByPk(id)
        if (!checkRouleProfileAccess(user.groups, roules.administrator) && userInDb.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        await User.destroy({ where: { id } });

        if (userInDb.type === userType.USER) {
            const item = await findUserById(userInDb.userAWSId)
            if (item) {
                const { Username } = item
                await cognitoRequest(cognito.adminDeleteUser, { Username });
            }
        }

        await imageService.remove(userInDb.image);

        return handlerResponse(200, {}, `${RESOURCE_NAME} ${userInDb.name} removido com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
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

module.exports.listAll = async (event) => {
    const { queryStringParameters } = event
    try {
        const whereStatement = {};
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId

        const resp = await User.findAll({
            where: whereStatement,
            attributes: ['id', 'name', 'type'],
            order: [['name', 'ASC']],
            // include: [
            //     {
            //         model: Company,
            //         as: 'company',
            //         attributes: ['name'],
            //     }]
        })

        const respFormated = resp.map(item => ({
            value: item.id,
            label: item.name,
            type: item.type
        }));
        return handlerResponse(200, respFormated)
    } catch (err) {
        return await handlerErrResponse(err, queryStringParameters)
    }
}