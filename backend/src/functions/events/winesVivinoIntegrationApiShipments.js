
"use strict";

const axios = require('axios');
const { startOfDay, endOfDay, subDays } = require('date-fns');
const db = require('../../database');
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const { executeUpdate, executeSelect } = require("../../services/ExecuteQueryService");
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getVivinoUrl } = require("../../utils");

module.exports.handler = async (event, context) => {

    let companyId = '';
    let [dateReference, hour] = new Date().toISOString().split('T');

    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const { queryStringParameters } = event
        if (queryStringParameters)
            dateReference = queryStringParameters.dateReference

        const resp = await Company.findAll({
            attributes: ['id', 'name', 'vivinoId', 'vivinoAuthToken', 'vivinoClientId'],
            where: { vivinoApiIntegrationActive: true, active: true },
        });
        let sales = 0, salesUpdated = 0;
        for (let i = 0; i < resp.length; i++) {

            const element = resp[i];
            companyId = element.id;
            const startDate = subDays(new Date(dateReference), 7);
            const query = ` SELECT code FROM wineSales WHERE 
                            companyId = '${companyId}' AND
                            trackingUrl IS NULL AND
                            createdAt BETWEEN '${startOfDay(startDate).toISOString()}' AND '${endOfDay(new Date(dateReference)).toISOString()} 
                            ORDER BY id DESC'`
            const codes = await executeSelect(query);
            sales = codes.length;
            for (let j = 0; j < codes.length; j++) {
                const { code } = codes[j];

                const data = await getVivinoShipmentLink(element, code);
                if (!data || !data.shipments.length)
                    continue;
                const [tracking] = data.shipments
                const queryUpdate = `UPDATE wineSales SET 
                                        trackingUrl = '${tracking.tracking_url}', 
                                        noteNumber = '${tracking.tracking_number}', 
                                        updatedAt = NOW() 
                                        WHERE companyId = '${companyId}' AND code = '${code}'`;
                await executeUpdate(queryUpdate);
                salesUpdated++;
            }

        }
        const message = `${sales} vendas pesquisadas, ${salesUpdated} alteradas com sucesso`;
        console.log(message);
        return handlerResponse(200, { sales }, message);
    } catch (err) {
        const message = `ERRO AO BUSCAR LINK DE RASTREIO EMPRESA COD ${companyId} NA API VIVINO DATA ${dateReference}`
        return await handlerErrResponse(err, null, message)
    }
};

const getVivinoShipmentLink = async (element, code) => {
    const config = {
        method: 'GET',
        maxBodyLength: Infinity,
        url: `${getVivinoUrl(element.vivinoClientId)}/purchase_orders/${code}/shipments?app_version=9.0`,
        headers: { 'Authorization': `Bearer ${element.vivinoAuthToken}` }
    };

    const { data } = await axios(config);
    return data;
}
