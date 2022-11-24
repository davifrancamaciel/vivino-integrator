"use strict";

const { Op } = require('sequelize');
const { startOfDay, endOfDay, parseISO, addMonths } = require('date-fns');
const db = require('../database');
const ExpenseType = require('../models/ExpenseType')(db.sequelize, db.Sequelize);
const Expense = require('../models/Expense')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../services/UserService");
const { roules } = require("../utils/defaultValues");

const RESOURCE_NAME = 'Despesa'

module.exports.list = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const whereStatement = {};
        const whereExpenseTypes = {};

        if (event.queryStringParameters) {
            const {
                id, expenseTypeName, title, description, paidOut,
                paymentDateStart, paymentDateEnd, createdAtStart, createdAtEnd
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
        }

        const { pageSize, pageNumber } = event.queryStringParameters
        const { count, rows } = await Expense.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * Number(pageSize),
            order: [['id', 'DESC']],
            include: [
                {
                    model: ExpenseType,
                    as: 'expenseTypes',
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
        const result = await Expense.findByPk(pathParameters.id, {
            include: [
                {
                    model: ExpenseType,
                    as: 'expenseTypes',
                    attributes: ['name'],
                }]
        })
        if (!result)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada`)

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
            objOnSave.title = `1ª parcela de ${objOnSave.dividedIn} ${objOnSave.title}`
            objOnSave.value = Number(body.value) / objOnSave.dividedIn
        }
        const result = await Expense.create(objOnSave);


        if (objOnSave.dividedIn > 1 && objOnSave.dividedIn <= 24) {
            for (let i = 1; i < objOnSave.dividedIn; i++) {
                const obtOnSavePortion = {
                    ...objOnSave,
                    title: objOnSave.title.replace('1ª', `${i + 1}ª`),
                    expenseDadId: result.id,
                    paymentDate: addMonths(parseISO(objOnSave.paymentDate), i)
                }
                await Expense.create(obtOnSavePortion);
            }
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

        console.log('BODY ', body)
        console.log('DESPESA ALTERADA DE ', item.dataValues)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada`)


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
        await Expense.destroy({ where: { id } });
        return handlerResponse(200, {}, `${RESOURCE_NAME} código (${id}) removida com sucesso`)
    } catch (err) {
        return handlerErrResponse(err, pathParameters)
    }
}