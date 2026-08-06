"use strict";
const { endOfMonth, subMonths } = require('date-fns');


const limitCurrentYear = (date, coll) => {
    const currentDate = new Date()
    const dateLimit = endOfMonth(subMonths(currentDate, 1)).toISOString();
    return date.getFullYear() >= currentDate.getFullYear() ? `AND DATE(${coll}) <= DATE('${dateLimit}')` : '';
}

const andCompany = (alias, companyId) =>
    companyId ? `AND ${alias}.companyId IN ('${companyId}')` : ''

module.exports = { limitCurrentYear, andCompany }