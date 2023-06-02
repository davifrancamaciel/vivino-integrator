"use strict";

const { startOfMonth, endOfMonth, startOfDay, endOfDay, subDays } = require('date-fns');
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../../services/UserService");
const { roules } = require("../../utils/defaultValues");

const { executeSelect } = require("../../services/ExecuteQueryService");

module.exports.cards = async (event, context) => {
    try {

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        let data = {
            winesActive: { count: 0, },
            winesNotActive: { count: 0, },
            winesSalesDay: { count: 0, },
            winesSalesMonth: { count: 0, },
            sales: {
                count: 0,
                commissionMonth: 0,
                totalValueMonth: 0,
                commissionUser: 0,
            }
        }

        let isAdm = checkRouleProfileAccess(user.groups, roules.administrator);
        let date = new Date();
        const { queryStringParameters } = event
        if (queryStringParameters && queryStringParameters.dateReference)
            date = new Date(queryStringParameters.dateReference)

        if (checkRouleProfileAccess(user.groups, roules.wines)) {
            data.winesActive = await winesActive(isAdm, user)
            data.winesNotActive = await winesNotActive(isAdm, user)
            data.winesSalesDay = await winesSalesDay(date, isAdm, user)          
            data.winesSalesMonth = await winesSalesMonth(date, isAdm, user)
        }

        if (checkRouleProfileAccess(user.groups, roules.sales)) 
            data.sales = await salesMonth(date, isAdm, user)
        
        if (checkRouleProfileAccess(user.groups, roules.expenses)) 
            data.expenses = await expensesMonth(date, isAdm, user)
        
        return handlerResponse(200, data)
    } catch (err) {
        return await handlerErrResponse(err)
    }
};

const salesMonth = async (date, isAdm, user) => {
    const commission = `(SELECT SUM(u.commissionMonth) FROM users u WHERE u.commissionMonth > 0 ${isAdm ? '' : `AND u.companyId = '${user.companyId}'`})`
    const commissionUser = `(SELECT c.commissionMonth FROM users c WHERE c.id = ${user.userId})`;
    const query = ` SELECT 
                        COUNT(s.id) count, 
                        SUM(s.value) totalValueMonth, 
                        ${commission} commissionMonth, 
                        ${commissionUser} commissionUser 
                    FROM sales s 
                    WHERE s.createdAt BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}' 
                    ${isAdm ? '' : `AND s.companyId = '${user.companyId}'`}`
    const [result] = await executeSelect(query);
    return result
}

const expensesMonth = async (date, isAdm, user) => {
    const query = ` SELECT COUNT(e.id) count, SUM(e.value) totalValueMonth FROM expenses e 
                    WHERE e.createdAt BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}' 
                    ${isAdm ? '' : `AND e.companyId = '${user.companyId}'`}`
    const [result] = await executeSelect(query);
    return result
}

const winesActive = async (isAdm, user) => {

    const query = ` SELECT COUNT(id) count FROM wines 
                    WHERE  active = true AND 
                        inventoryCount > 0 AND 
                        bottleQuantity > 0 
                        ${isAdm ? '' : `AND companyId = '${user.companyId}'`}`
    const [result] = await executeSelect(query);
    return result
}

const winesNotActive = async (isAdm, user) => {
    const query = ` SELECT COUNT(id) count FROM wines 
                    WHERE active = false ${isAdm ? '' : `AND companyId = '${user.companyId}'`}`
    const [result] = await executeSelect(query);
    return result
}

const winesSalesDay = async (date, isAdm, user) => {
    let dateReference = subDays(date, 1);
    const query = ` SELECT SUM(total) count FROM wineSaleHistories 
                    WHERE dateReference BETWEEN '${startOfDay(dateReference).toISOString()}' AND '${endOfDay(dateReference).toISOString()}' 
                    ${isAdm ? '' : `AND companyId = '${user.companyId}'`}`
    const [result] = await executeSelect(query);
    return result
}

const winesSalesMonth = async (date, isAdm, user) => {
    const query = ` SELECT SUM(total) count FROM wineSaleHistories 
                    WHERE dateReference BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}' 
                    ${isAdm ? '' : `AND companyId = '${user.companyId}'`}`
    const [result] = await executeSelect(query);
    return result
}
