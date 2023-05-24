"use strict";

const { Op } = require('sequelize');
const { startOfDay, endOfDay, parseISO, addMonths } = require('date-fns');
const db = require('../../database');
const ExpenseType = require('../../models/ExpenseType')(db.sequelize, db.Sequelize);
const Expense = require('../../models/Expense')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { roules } = require("../../utils/defaultValues");

const RESOURCE_NAME = 'Despesa'

module.exports.list = async (event, context) => {
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        context.callbackWaitsForEmptyEventLoop = false;

        const whereStatement = {};
        const whereExpenseTypes = {};

        if (event.queryStringParameters) {
            const {
                id, expenseTypeName, title, description, paidOut,
                paymentDateStart, paymentDateEnd, createdAtStart, createdAtEnd, myCommision
            } = event.queryStringParameters

            if (id) whereStatement.id = id;

            if (expenseTypeName)
                whereExpenseTypes.name = { [Op.like]: `%${expenseTypeName}%` }

            if (paidOut !== undefined && paidOut !== '')
                whereStatement.paidOut = paidOut === 'true';
            if (description)
                whereStatement.description = { [Op.like]: `%${description}%` }

            if (title)
                whereStatement.title = { [Op.like]: `%${title}%` }

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

            if (paymentDateStart)
                whereStatement.paymentDate = {
                    [Op.gte]: startOfDay(parseISO(paymentDateStart)),
                };

            if (paymentDateEnd)
                whereStatement.paymentDate = {
                    [Op.lte]: endOfDay(parseISO(paymentDateEnd)),
                };
            if (paymentDateStart && paymentDateEnd)
                whereStatement.paymentDate = {
                    [Op.between]: [
                        startOfDay(parseISO(paymentDateStart)),
                        endOfDay(parseISO(paymentDateEnd)),
                    ],
                };
            if (myCommision)
                whereStatement.userId = user.userId
        }

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId;

        if (!checkRouleProfileAccess(user.groups, roules.expenses))
            whereStatement.userId = user.userId;

        const { pageSize, pageNumber } = event.queryStringParameters
        const { count, rows } = await Expense.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * Number(pageSize),
            order: [['id', 'DESC']],
            include: [
                {
                    model: ExpenseType,
                    as: 'expenseType',
                    attributes: ['name'],
                    where: whereExpenseTypes
                }
            ]
        })

        return handlerResponse(200, { count, rows })

    } catch (err) {
        return handlerErrResponse(err)
    }
};

module.exports.listById = async (event) => {
    const { pathParameters } = event
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        if (!checkRouleProfileAccess(user.groups, roules.expenses))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const result = await Expense.findByPk(pathParameters.id, {
            include: [
                {
                    model: ExpenseType,
                    as: 'expenseType',
                    attributes: ['name'],
                }]
        })
        if (!result)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada`)

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && result.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

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

        if (!checkRouleProfileAccess(user.groups, roules.expenses))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        let objOnSave = body
        objOnSave.dividedIn = Number(body.dividedIn || 1)

        if (!objOnSave.paymentDate)
            objOnSave.paymentDate = new Date()

        if (objOnSave.dividedIn > 1) {
            objOnSave.title = `1ª parcela de ${objOnSave.dividedIn} ${objOnSave.title ? objOnSave.title : ''}`
            objOnSave.value = Number(body.value) / objOnSave.dividedIn
        }

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            objOnSave.companyId = user.companyId

        const result = await Expense.create(objOnSave);

        if (objOnSave.dividedIn > 1 && objOnSave.dividedIn <= 24) {
            let espensesList = []
            for (let i = 1; i < objOnSave.dividedIn; i++) {
                const obtOnSavePortion = {
                    ...objOnSave,
                    title: objOnSave.title.replace('1ª', `${i + 1}ª`),
                    expenseDadId: result.id,
                    paymentDate: addMonths(parseISO(objOnSave.paymentDate), i)
                }
                espensesList.push(obtOnSavePortion)
            }
            await Expense.bulkCreate(espensesList);
        }

        return handlerResponse(201, result, `${RESOURCE_NAME} criada com sucesso`)
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

        if (!checkRouleProfileAccess(user.groups, roules.expenses))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = body
        const item = await Expense.findByPk(Number(id))

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.expenseTypeId === 1) {
            body.expenseTypeId = item.expenseTypeId;
            body.value = item.value;
            body.title = item.title;
            body.description = item.description;
        }

        console.log('BODY ', body)
        console.log('DESPESA ALTERADA DE ', item.dataValues)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada`)

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        const result = await item.update(body);
        console.log('PARA ', result.dataValues)

        return handlerResponse(200, result, `${RESOURCE_NAME} alterada com sucesso`)
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

        if (!checkRouleProfileAccess(user.groups, roules.expenses))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = pathParameters
        const item = await Expense.findByPk(id)
        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');
        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.expenseTypeId === 1)
            return handlerResponse(403, {}, 'Usuário não tem permissão apagar este tipo de despesa')

        await Expense.destroy({ where: { id } });
        return handlerResponse(200, {}, `${RESOURCE_NAME} código (${id}) removida com sucesso`)
    } catch (err) {
        return handlerErrResponse(err, pathParameters)
    }
}