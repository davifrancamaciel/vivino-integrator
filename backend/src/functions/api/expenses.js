"use strict";

const { Op } = require('sequelize');
const { startOfDay, endOfDay, parseISO, addMonths } = require('date-fns');
const db = require('../../database');
const Expense = require('../../models/Expense')(db.sequelize, db.Sequelize);
const ExpenseType = require('../../models/ExpenseType')(db.sequelize, db.Sequelize);
// const Vehicle = require('../../models/Vehicle')(db.sequelize, db.Sequelize);
const User = require('../../models/User')(db.sequelize, db.Sequelize);
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { roules } = require("../../utils/defaultValues");
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const expensesRepository = require('../../repositories/expensesRepository')
const { executeDelete } = require("../../services/ExecuteQueryService");
const { getCompaniesIds } = require("../../repositories/companiesRepository");
const { createRouter } = require("../../utils/requestRouter");

const RESOURCE_NAME = 'Despesa'

const list = async (event, context) => {
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')
        

        const whereStatement = {};
        const whereExpenseTypes = {};
        const whereStatementUsers = {};
        const whereStatementSuppiers = {};
        // const whereStatementVehicles = {};
        let ids = [];

        const {
            id, title, description, paidOut, vehicleModel, userName,
            paymentDateStart, paymentDateEnd, createdAtStart, createdAtEnd, myCommision, companyId, field, order
        } = event.queryStringParameters

        const { expenseTypeId } = event.multiValueQueryStringParameters

        if (checkRouleProfileAccess(user.groups, roules.administrator)) {
            ids = await getCompaniesIds(user);
            whereStatement.companyId = { [Op.in]: ids };
        }

        if (companyId) whereStatement.companyId = companyId;

        if (!checkRouleProfileAccess(user.groups, roules.administrator))
            whereStatement.companyId = user.companyId

        if (id) whereStatement.id = id;

        if (paidOut !== undefined && paidOut !== '')
            whereStatement.paidOut = paidOut === 'true';
        if (description)
            whereStatement.description = { [Op.like]: `%${description}%` }
        if (userName && !expenseTypeId)
            whereStatementUsers.name = { [Op.like]: `%${userName}%` }
        if (userName && expenseTypeId)
            whereStatementSuppiers.name = { [Op.like]: `%${userName}%` }

        // if (vehicleModel)
        //     whereStatementVehicles.model = { [Op.like]: `%${vehicleModel}%` }

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
        
        if (expenseTypeId)
            whereStatement.expenseTypeId = { [Op.in]: expenseTypeId }
        else
            whereStatement.expenseTypeId = { [Op.gt]: 1, }


        if (!checkRouleProfileAccess(user.groups, roules.expenses))
            whereStatement.userId = user.userId;

        let arrayOrder = [[field ? field : 'paymentDate', order ? order : 'asc']]
        if (field === 'expenseTypeName')
            arrayOrder = [['expenseType', 'name', order], ['paymentDate', 'asc']]


        const { pageSize, pageNumber } = event.queryStringParameters
        const { count, rows } = await Expense.findAndCountAll({
            where: whereStatement,
            limit: Number(pageSize) || 10,
            offset: (Number(pageNumber) - 1) * Number(pageSize),
            // order: [['expenseType', 'name', 'ASC'], ['paymentDate', 'ASC']],
            order: arrayOrder,
            include: [
                { model: Company, as: 'company', attributes: ['name', 'image'] },
                {
                    model: ExpenseType,
                    as: 'expenseType',
                    attributes: ['name', 'description', 'replicateNextMonth'],
                    where: whereExpenseTypes
                },
                {
                    model: User, as: 'user',
                    attributes: ['name'],
                    where: whereStatementUsers,
                    required: whereStatementUsers.name ? true : false
                },
                // {
                //     model: Vehicle, as: 'vehicle',
                //     attributes: ['model'],
                //     where: whereStatementVehicles,
                //     required: whereStatementVehicles.model ? true : false
                // },
                // {
                //     model: User, as: 'supplier',
                //     attributes: ['name'],
                //     where: whereStatementSuppiers,
                //     required: whereStatementSuppiers.name ? true : false
                // },
            ]
        })
        let data;
        if (Number(pageNumber) == 1) {
            const isAdm = checkRouleProfileAccess(user.groups, roules.administrator);
            const companyIdSearchQuery = companyId ? companyId : ids.map(x => x).join("','");
            const pay = await expensesRepository.expensesByPeriod(paymentDateStart, paymentDateEnd, isAdm, user, title, expenseTypeId, companyIdSearchQuery);
            const type = await expensesRepository.expensesMonthByType(paymentDateStart, paymentDateEnd, isAdm, user, title, expenseTypeId, companyIdSearchQuery);
            data = { pay, type }
        }
        return handlerResponse(200, { count, rows, data })

    } catch (err) {
        return await handlerErrResponse(err)
    }
};

const listById = async (event) => {
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
        return await handlerErrResponse(err, pathParameters)
    }
}

const create = async (event) => {
    const body = JSON.parse(event.body)
    try {

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.expenses))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        let objOnSave = body
        objOnSave.dividedIn = Number(body.dividedIn || 1);

        if (!checkRouleProfileAccess(user.groups, roules.administrator) || !objOnSave.companyId)
            objOnSave.companyId = user.companyId

        if (!objOnSave.paymentDate)
            objOnSave.paymentDate = new Date()

        if (objOnSave.dividedIn > 1) {
            objOnSave.title = `${objOnSave.title ? objOnSave.title : ''} 1/${objOnSave.dividedIn}`
            objOnSave.value = Number(body.value) / objOnSave.dividedIn
        }

        const result = await Expense.create(objOnSave);

        if (objOnSave.dividedIn > 1 && objOnSave.dividedIn <= 24) {
            let espensesList = []
            for (let i = 1; i < objOnSave.dividedIn; i++) {
                const obtOnSavePortion = {
                    ...objOnSave,
                    title: objOnSave.title.replace('1/', `${i + 1}/`),
                    expenseDadId: result.id,
                    paymentDate: addMonths(parseISO(objOnSave.paymentDate), i)
                }
                espensesList.push(obtOnSavePortion)
            }
            await Expense.bulkCreate(espensesList);
        }

        return handlerResponse(201, result, `${getTitle(objOnSave.expenseTypeId)} criada com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err, body)
    }
}

const update = async (event) => {
    const body = JSON.parse(event.body)
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.expenses))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = body
        const item = await Expense.findByPk(Number(id))
        let message = ''

        console.log('BODY ', body)
        console.log('DESPESA ALTERADA DE ', item.dataValues)
        if (!item)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrada`)

        if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

        const result = await item.update(body);
        console.log('PARA ', result.dataValues)

        return handlerResponse(200, result, `${getTitle(item.expenseTypeId)} alterada com sucesso. ${message}`)
    } catch (err) {
        return await handlerErrResponse(err, body)
    }
}

const deleteFn = async (event) => {
    const { pathParameters } = event
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!checkRouleProfileAccess(user.groups, roules.expenses))
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body);
            const { ids } = body;

            const query = `DELETE FROM expenses WHERE id IN (${ids.map(x => x).join(',')})`;
            await executeDelete(query);

            return handlerResponse(200, {}, `Items removidos com sucesso`)
        }

        if (event.httpMethod === 'DELETE') {
            const { id } = pathParameters
            const item = await Expense.findByPk(id)
            if (!checkRouleProfileAccess(user.groups, roules.administrator) && item.companyId !== user.companyId)
                return handlerResponse(403, {}, 'Usuário não tem permissão acessar este cadastro');

            await Expense.destroy({ where: { id } });
            return handlerResponse(200, {}, `${getTitle(item.expenseTypeId)} código (${id}) removida com sucesso`)
        }
    } catch (err) {
        return await handlerErrResponse(err, pathParameters)
    }
}


const getTitle = (type, isPlural = false) => {
    switch (type) {
        case 1:
            return `Compra${isPlural ? 's' : ''}`;

        default:
            return `Pagamento${isPlural ? 's' : ''}`;
    }
};

module.exports.handler = createRouter({
    list,
    listById,
    create,
    update,
    delete: deleteFn
});