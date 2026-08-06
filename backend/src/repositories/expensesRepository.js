"use strict";

const { startOfYear, startOfMonth, endOfMonth } = require('date-fns');
const { executeSelect } = require("../services/ExecuteQueryService");
const { limitCurrentYear, andCompany } = require("./utils");



const where = (paymentDateStart, paymentDateEnd, isAdm, user, title, expenseTypeId, companyId) => {

    const queryDate = paymentDateStart && paymentDateEnd ? `AND e.paymentDate BETWEEN '${paymentDateStart}' AND '${paymentDateEnd}'` : '';
    const queryType = expenseTypeId ? `AND e.expenseTypeId IN (${expenseTypeId})` : 'AND e.expenseTypeId <> 1';
    const queryCompany = isAdm ? andCompany('e', companyId) : andCompany('e', user.companyId);

    const query = ` WHERE e.id > 0 ${queryDate} ${queryType} ${queryCompany} 
                    AND e.title LIKE '%${title}%' `
    return query;
}

const expensesByPeriod = async (paymentDateStart, paymentDateEnd, isAdm, user, title, expenseTypeId, companyId) => {
    const query = ` SELECT COUNT(e.id) count, SUM(e.value) totalValueMonth, e.paidOut FROM expenses e 
                    LEFT JOIN expenseTypes t ON t.id = e.expenseTypeId 
                    ${where(paymentDateStart, paymentDateEnd, isAdm, user, title, expenseTypeId, companyId)}  
                    GROUP BY e.paidOut`
    const result = await executeSelect(query);
    return result;
}

const expensesMonthByType = async (paymentDateStart, paymentDateEnd, isAdm, user, title, expenseTypeId, companyId) => {
    const query = ` SELECT COUNT(e.id) count, SUM(e.value) totalValueMonth, t.name, t.id FROM expenses e 
                    LEFT JOIN expenseTypes t ON t.id = e.expenseTypeId 
                    ${where(paymentDateStart, paymentDateEnd, isAdm, user, title, expenseTypeId, companyId)}
                    GROUP BY e.expenseTypeId`;
    const result = await executeSelect(query);
    return result;
}

const expensesMonthDash = async (date, isAdm, user, companyId) => {

    const query = ` SELECT COUNT(e.id) count, SUM(e.value) totalValueMonth, e.paidOut FROM expenses e 
                    LEFT JOIN expenseTypes t ON t.id = e.expenseTypeId 
                    WHERE e.paymentDate BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}' 
                    AND e.saleId IS NULL ${isAdm ? andCompany('e', companyId) : andCompany('e', user.companyId)}
                    GROUP BY e.paidOut`

    const result = await executeSelect(query);
    return result
}

const expensesMonthByTypeDash = async (date, isAdm, user, companyId, acc = false) => {
    const start = !acc ? startOfMonth(date).toISOString() : startOfYear(date).toISOString();
    const query = ` SELECT COUNT(e.id) count, SUM(e.value) totalValueMonth, t.name, t.id FROM expenses e 
                    LEFT JOIN expenseTypes t ON t.id = e.expenseTypeId 
                    WHERE e.paymentDate BETWEEN '${start}' AND '${endOfMonth(date).toISOString()}' 
                    AND e.saleId IS NULL ${isAdm ? andCompany('e', companyId) : andCompany('e', user.companyId)}
                    GROUP BY e.expenseTypeId`

    const result = await executeSelect(query);
    return result
}

const getExpensesOpenPaymentByType = async (date, isAdm, user, companyId, expenseTypeId, paidOut = false,) => {
    const query = ` SELECT COUNT(e.id) count, SUM(e.value) totalValueMonth, t.name, t.id FROM expenses e 
                    LEFT JOIN expenseTypes t ON t.id = e.expenseTypeId 
                    WHERE e.paymentDate >= '${startOfYear(date).toISOString()}' AND e.paidOut = ${paidOut} AND e.expenseTypeId IN(${expenseTypeId})  
                    ${isAdm ? andCompany('e', companyId) : andCompany('e', user.companyId)}
                    GROUP BY e.expenseTypeId`

    const result = await executeSelect(query);
    return result
}

const expensesMonthByTypeDre = async (date, isAdm, user, companyId) => {
    const dateString = startOfMonth(date).toISOString()
    const query = ` SELECT et.name, SUM(e.value) total,MONTH(e.paymentDate) month, YEAR(e.paymentDate) year, e.expenseTypeId, et.description
                    FROM expenses e 
                    INNER JOIN expenseTypes et ON et.id = e.expenseTypeId
                    WHERE YEAR(e.paymentDate) = YEAR('${dateString}') ${limitCurrentYear(date, 'e.paymentDate')}
                          ${isAdm ? andCompany('e', companyId) : andCompany('e', user.companyId)}  
                    GROUP BY et.name, MONTH (e.paymentDate), YEAR(e.paymentDate), e.expenseTypeId  
                    ORDER BY YEAR(e.paymentDate) DESC, MONTH (e.paymentDate) DESC, et.name`
    //-- AND e.paidOut = true
    const result = await executeSelect(query);
    return result
}
module.exports = { expensesMonthDash, expensesMonthByTypeDash, expensesByPeriod, expensesMonthByType, expensesMonthByTypeDre, getExpensesOpenPaymentByType }