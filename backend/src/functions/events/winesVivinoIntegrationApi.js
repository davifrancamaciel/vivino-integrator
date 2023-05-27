"use strict";

const axios = require('axios');
const FormData = require('form-data');
const db = require('../../database');
const { subDays, endOfDay, startOfDay, addHours } = require('date-fns');
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const { executeUpdate } = require("../../services/ExecuteQueryService");
const { sendMessage } = require('../../services/AwsQueueService')

const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");

module.exports.auth = async (event, context) => {
    let companyId = '';
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const resp = await Company.findAll({
            attributes: ['id', 'name', 'vivinoClientId', 'vivinoClientSecret', 'vivinoClientUsername', 'vivinoPassword'],
            where: { vivinoApiIntegrationActive: true, active: true },
        })

        let responseAuth = null;

        for (let i = 0; i < resp.length; i++) {
            const element = resp[i];

            companyId = element.id;

            const formData = new FormData();
            formData.append('client_id', element.vivinoClientId);
            formData.append('client_secret', element.vivinoClientSecret);
            formData.append('username', element.vivinoClientUsername);
            formData.append('password', element.vivinoPassword);
            formData.append('grant_type', 'password');

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${process.env.VIVINO_API_URL}/oauth/token?app_version=8.19&app_platform=`,
                headers: { ...formData.getHeaders() },
                data: formData
            };

            const { data } = await axios(config)
            responseAuth = data;

            const query = `UPDATE companies SET vivinoAuthToken = '${data.access_token}', updatedAt = NOW() WHERE id = '${companyId}'`;
            await executeUpdate(query);
            console.log(`EMPRESA ${element.name} COD ${companyId} AUTENTICADA COM SUCESSO NA API VIVINO TOKEN ${data.access_token}`)
        }

        return handlerResponse(200, responseAuth, 'Empresas autenticadas com sucesso')
    } catch (err) {
        const message = `ERRO AO AUTENTICAR EMPRESA COD ${companyId} NA API VIVINO DATA ${new Date()}`
        console.error(message)
        await sendMessage('wines-sales-update-queue-dlq', { message, err });
        return handlerErrResponse(err, null, message)
    }
};

module.exports.sales = async (event, context) => {

    let companyId = '';
    let [dateReference, hour] = subDays(new Date(), 1).toISOString().split('T');

    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const status = 'Approved', limit = 2000;

        const { queryStringParameters } = event
        if (queryStringParameters)
            dateReference = queryStringParameters.dateReference

        const resp = await Company.findAll({
            attributes: ['id', 'name', 'vivinoId', 'vivinoAuthToken'],
            where: { vivinoApiIntegrationActive: true, active: true },
        })

        let response = null, queueObj = null;

        for (let i = 0; i < resp.length; i++) {
            const element = resp[i];
            companyId = element.id;

            console.log(`BUSCANDO VENDAS DA EMPRESA ${element.name} COD ${companyId} NA API VIVINO DATA ${dateReference}`)

            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${process.env.VIVINO_API_URL}/merchants/${element.vivinoId}/purchase_orders/_active?app_version=8.19&status=${status}&limit=${limit}&start_date=${dateReference}&end_date=${dateReference}`,
                headers: { 'Authorization': `Bearer ${element.vivinoAuthToken}` }
            };

            const { data } = await axios(config);
            response = data;
            let itemsProducts = [];

            if (data) {
                data.forEach(element => {
                    const { items, id, created_at, user } = element;
                    const saleDate = new Date(created_at)
                    const reference = addHours(new Date(dateReference), 4)
                    const start = startOfDay(reference);
                    const end = endOfDay(reference);

                    if (saleDate >= start && saleDate <= end) {
                        console.log(`${id} NA DATA ${created_at}`)
                    } else {
                        console.log(`${id} FORA DA DATA ${created_at}`)
                    }
                    items && items.forEach(elementItem => itemsProducts.push({
                        sale: {
                            id,
                            created_at,
                            unit_count: elementItem.unit_count,
                            user
                        },
                        ...elementItem
                    }));
                });
            }

            const itemsProductsGroupBySku = groupBy(itemsProducts, 'sku')
            const productsSales = itemsProductsGroupBySku.map(list => {
                const [product] = list
                const sales = list.map(x => x.sale)
                return {
                    id: product.sku,
                    total: sum(list, 'unit_count'),
                    sales
                }
            });
            console.log(data);

            console.log(`${data?.length} VENDAS ENCONTRADAS`)

            queueObj = { companyId, dateReference: `${dateReference}T${hour}`, productsSales };
            await sendMessage('wines-sales-update-queue', queueObj);
        }

        return handlerResponse(200, { queueObj, response }, 'Vendas obtidas com sucesso')
    } catch (err) {
        const message = `ERRO AO BUSCAR VENDAS EMPRESA COD ${companyId} NA API VIVINO DATA ${dateReference}`
        console.error(message)
        await sendMessage('wines-sales-update-queue-dlq', { message, err });
        return handlerErrResponse(err, null, message)
    }
};

const groupBy = (arr, prop) => {
    const map = new Map(Array.from(arr, obj => [obj[prop], []]));
    arr.forEach(obj => map.get(obj[prop]).push(obj));
    return Array.from(map.values());
}

const sum = function (items, prop) {
    return items.reduce(function (a, b) {
        return a + b[prop];
    }, 0);
};