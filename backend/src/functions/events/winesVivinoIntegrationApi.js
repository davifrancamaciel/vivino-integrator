"use strict";

const axios = require('axios');
const FormData = require('form-data');
const db = require('../../database');
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const WineSale = require('../../models/WineSale')(db.sequelize, db.Sequelize);
const { executeUpdate, executeSelect } = require("../../services/ExecuteQueryService");
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
                method: 'POST',
                maxBodyLength: Infinity,
                url: `${getVivinoUrl(element.vivinoClientId)}/oauth/token?app_version=8.19&app_platform=`,
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
        return await handlerErrResponse(err, null, message)
    }
};

module.exports.sales = async (event, context) => {

    let companyId = '';
    let [dateReference, hour] = new Date().toISOString().split('T');

    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const status = 'Confirmed', limit = 2000;

        const { queryStringParameters } = event
        if (queryStringParameters)
            dateReference = queryStringParameters.dateReference

        const resp = await Company.findAll({
            attributes: ['id', 'name', 'vivinoId', 'vivinoAuthToken', 'vivinoClientId'],
            where: { vivinoApiIntegrationActive: true, active: true },
        })

        let response = null, queueObj = null;

        for (let i = 0; i < resp.length; i++) {
            const element = resp[i];
            companyId = element.id;

            console.log(`BUSCANDO VENDAS DA EMPRESA ${element.name} COD ${companyId} NA API VIVINO DATA ${dateReference}`)

            const config = {
                method: 'GET',
                maxBodyLength: Infinity,
                url: `${getVivinoUrl(element.vivinoClientId)}/merchants/${element.vivinoId}/purchase_orders/_active?app_version=8.19&status=${status}&limit=${limit}&start_date=${dateReference}&end_date=${dateReference}`,
                headers: { 'Authorization': `Bearer ${element.vivinoAuthToken}` }
            };

            let itemsProducts = [], sales = [];
            const { data } = await axios(config);
            response = data;

            if (data) {

                const codes = data.map(x => x.id).join(`','`)
                const query = `SELECT code FROM wineSales WHERE companyId = '${companyId}' AND code IN ('${codes}')`
                const salesIsExist = await executeSelect(query);

                data.forEach(element => {
                    const { items, id, created_at, user, confirmed_at } = element;

                    if (!salesIsExist.find(x => x.code === id)) {
                        const saleDate = new Date(created_at)
                        console.log(`${id} DATA created_at ${created_at} confirmed_at ${confirmed_at}`)

                        const sale = {
                            id: element.id,                            
                            user: element.user,
                            source: element.source,
                            billing: element.billing,
                            shipping: element.shipping,
                            created_at: element.created_at,
                            confirmed_at: element.confirmed_at,
                            authorized_at: element.authorized_at,
                            items_total_sum: element.items_total_sum,
                            items_units_sum: element.items_units_sum,
                            items: element.items.map(prod => ({ ...prod, "price-listing": null })),
                        };

                        sales.push({ companyId, code: id, value: element.items_total_sum, sale: JSON.stringify(sale), saleDate });

                        items && items.forEach(elementItem => itemsProducts.push({
                            sale: { id, created_at, unit_count: elementItem.unit_count, user }, ...elementItem
                        }));
                    } else {
                        console.warn(`${id} JÁ FOI IMPORTADA created_at ${created_at} confirmed_at ${confirmed_at}`)
                    }
                });
            }

            const itemsProductsGroupBySku = groupBy(itemsProducts, 'sku')
            const productsSales = itemsProductsGroupBySku.map(list => {
                const [product] = list
                const sales = list.map(x => x.sale)
                return { id: product.sku, total: sum(list, 'unit_count'), sales }
            });

            console.log(data);
            console.log(`${data?.length} VENDAS ENCONTRADAS`);
            console.log(`${sales?.length} VENDAS SERÃO CADASTRADAS`);

            queueObj = { companyId, dateReference: `${dateReference}T${hour}`, productsSales };
            if (productsSales.length)
                await sendMessage('wines-sales-update-queue', queueObj);

            if (sales.length)
                await WineSale.bulkCreate(sales)
        }

        return handlerResponse(200, { queueObj, response }, 'Vendas obtidas com sucesso')
    } catch (err) {
        const message = `ERRO AO BUSCAR VENDAS EMPRESA COD ${companyId} NA API VIVINO DATA ${dateReference}`
        return await handlerErrResponse(err, null, message)
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

const getVivinoUrl = (vivinoClientId) => {
    const { VIVINO_API_URL } = process.env
    return !vivinoClientId.includes('TESTING') ? VIVINO_API_URL.replace('testing.', '') : VIVINO_API_URL
}