"use strict";

const { executeSelect } = require("../services/ExecuteQueryService");

const getCompaniesIds = async (user) => {
    let ids = [user.companyId];

    const query = `SELECT companiesIds FROM companies WHERE id = '${user.companyId}'`;
    const [result] = await executeSelect(query);

    if (result && result.companiesIds && result.companiesIds.length)
        ids = result.companiesIds;

    return ids;
}

const getCompaniesIdsMap = async (user) => {
    let ids = await getCompaniesIds(user)

    return ids.map(x => x).join("','");
}

module.exports = { getCompaniesIds, getCompaniesIdsMap }