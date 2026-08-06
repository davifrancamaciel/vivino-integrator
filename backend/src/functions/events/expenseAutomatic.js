"use strict";

const { startOfMonth } = require('date-fns');
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { executeInsert } = require("../../services/ExecuteQueryService");

module.exports.handler = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        let date = new Date();

        const { queryStringParameters } = event
        if (queryStringParameters)
            date = new Date(queryStringParameters.dateReference);

        await createReplicatedExpenses(date, false);
        
        await createReplicatedExpenses(date, true);

        return handlerResponse(200, {}, 'Despesas geradas com sucesso')
    } catch (err) {
        return await handlerErrResponse(err)
    }
};

const createReplicatedExpenses = async (date, isUser) => {
    const dateString = startOfMonth(date).toISOString().split('T')[0];
    const query = ` INSERT INTO expenses
                    (companyId, expenseTypeId, userId, value, title, description, paymentDate, createdAt, updatedAt, paidOut, replicateNextMonth)
                    SELECT e.companyId, expenseTypeId, userId, value, title, e.description, DATE_ADD(paymentDate, INTERVAL 1 MONTH) paymentDate, NOW() createdAt, NOW() updatedAt, false paidOut, true replicateNextMonth
                    FROM expenses e 
                    INNER JOIN companies c ON c.id = e.companyId
                    INNER JOIN expenseTypes et ON et.id = e.expenseTypeId 
                    ${isUser ? `INNER JOIN users u ON u.id = e.userId` : ''}
                    WHERE 	MONTH(e.paymentDate) = MONTH(DATE('${dateString}')) AND 
                            YEAR(e.paymentDate) = YEAR(DATE('${dateString}')) AND 
                            c.active = true AND 
                            e.replicateNextMonth = true AND 
                            et.replicateNextMonth = true AND 
                            ${isUser ? `u.active = true` : 'e.userId IS NULL'}`

    await executeInsert(query);   
}