"use strict";

const { Op } = require('sequelize');
const axios = require('axios');
const FormData = require('form-data');
const db = require('../../database');
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const WineSale = require('../../models/WineSale')(db.sequelize, db.Sequelize);
const { executeUpdate, executeSelect } = require("../../services/ExecuteQueryService");
const { sendMessage } = require('../../services/AwsQueueService')
const UserClientWineService = require('../../services/UserClientWineService')
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

            let idsBySkus = [], skusNotFoundArray = []
            const itemsProductsGroupBySku = groupBy(itemsProducts, 'sku')
            const skus = itemsProductsGroupBySku.map(list => {
                const [product] = list
                return product.sku;
            }).filter(x => x.includes('-')).join("','");
            if (skus)
                idsBySkus = await executeSelect(`SELECT id, skuVivino FROM wines WHERE companyId = '${companyId}' AND skuVivino IN ('${skus}')`)

            const productsSales = itemsProductsGroupBySku.map(list => {
                const [product] = list
                const sales = list.map(x => x.sale)
                let wineId = 0;
                if (!product.sku.includes('-'))
                    wineId = Number(product.sku)
                else {
                    const wineIdFound = idsBySkus.find(x => x.skuVivino === product.sku)
                    if (wineIdFound)
                        wineId = wineIdFound.id;
                    else
                        skusNotFoundArray.push(product.sku);
                }
                return { id: wineId, total: sum(list, 'unit_count'), sales }
            });
            
            const itemsProductsGroupById = groupBy(productsSales, 'id')
            const productsSalesGrouped = itemsProductsGroupById.map(list => {
                const [wine] = list;
                let sales = [];
                list.forEach(elementList => elementList.sales.forEach(elementSales => sales.push(elementSales)));
                return { id: wine.id, total: sum(list, 'total'), sales }
            });

            console.log(data);
            console.log(`${data?.length} VENDAS ENCONTRADAS`);
            console.log(`${sales?.length} VENDAS SERÃO CADASTRADAS`);

            queueObj = { companyId, dateReference: `${dateReference}T${hour}`, productsSales: productsSalesGrouped };
            if (productsSalesGrouped.length)
                await sendMessage('wines-sales-update-queue', queueObj);

            if (sales.length) {
                await WineSale.bulkCreate(sales)
                await UserClientWineService.addClientBySale(sales)
            }
            if (skusNotFoundArray.length)
                await sendWarningSkuNotFound(skusNotFoundArray, companyId);
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

const sendWarningSkuNotFound = async (skusNotFoundArray, companyId) => {

    const skusNotFound = skusNotFoundArray?.join("', '");

    if (skusNotFound) {
        const [company] = await executeSelect(`SELECT name, email FROM companies WHERE id = '${companyId}'`)
        const subject = `ATENÇÃO! ${company.name}, os seguintes SKUs não foram encontrados`
        const to = [process.env.EMAIL_FROM_SENDER, company.email];
        const body = `<div style='padding:50px'>
                        <p>Integrador Vivino informa</p>                        
                        <p>ATENÇÃO! Os seguintes SKUs abaixo não foram encontrados</p>                        
                        <p><b>'${skusNotFound}'</b></p>                        
                        <p>Faça a associação no cadastro do vinho correspondente pois a falta deste mapeamento resulta na NÂO baixa no controle de estoque e contabilização dos vinhos vendidos</p>                        
                      </div>`;

        await sendMessage('send-email-queue', { to, subject, body, companyName: company.name });
    }
}

//#region processamento de vendas antigas com sku vivino
const arrayskus = [
    { sku: "VD-173266983", id: 10054 },
    { sku: "VD-174777880", id: 965 },
    { sku: "VD-169937700", id: 1621 },
    { sku: "VD-172695864", id: 10067 },
    { sku: "VD-171424406", id: 10069 },
    { sku: "VD-174777903", id: 1257 },
    { sku: "VD-168922651", id: 853 },
    { sku: "VD-169815663", id: 10068 },
    { sku: "VD-172635828", id: 1749 },
    { sku: "VD-170293076", id: 2110 },
    { sku: "VD-167819007", id: 957 },
    { sku: "VD-163290517", id: 1237 },
    { sku: "VD-162984306", id: 241 },
    { sku: "VD-166303609", id: 1753 },
    { sku: "VD-168635862", id: 1557 },
    { sku: "VD-165845189", id: 1273 },
    { sku: "VD-161025900", id: 1677 },
    { sku: "VD-164172029", id: 31 },
    { sku: "VD-170126070", id: 1777 },
    { sku: "VD-173074288", id: 2107 },
    { sku: "VD-142275746", id: 327 },
    { sku: "VD-169651950", id: 1625 },
    { sku: "VD-170126053", id: 1935 },
    { sku: "VD-168997679", id: 843 },
    { sku: "VD-166581839", id: 573 },
    { sku: "VD-170816215", id: 2103 },
    { sku: "VD-159726488", id: 7 },
    { sku: "VD-156341136", id: 1263 },
    { sku: "VD-164163495", id: 567 },
    { sku: "VD-172887376", id: 1946 },
    { sku: "VD-169882120", id: 1295 },
    { sku: "VD-170244898", id: 1741 },
    { sku: "VD-169879699", id: 1629 },
    { sku: "VD-172772271", id: 1948 },
    { sku: "VD-172613467", id: 1707 },
    { sku: "VD-171927307", id: 10066 },
    { sku: "VD-171684313", id: 79 },
    { sku: "VD-156135924", id: 1569 },
    { sku: "VD-167857723", id: 169 },
    { sku: "VD-164206547", id: 2100 },
    { sku: "VD-159459321", id: 1199 },
    { sku: "VD-169192805", id: 1931 },
    { sku: "AD-158923974", id: 409 },
    { sku: "AD-157871018", id: 403 },
    { sku: "AD-2730644", id: 805 },
    { sku: "AD-2769950", id: 2057 },
    { sku: "AD-1568747", id: 2056 },
    { sku: "AD-3682737", id: 239 },
    { sku: "AD-3476934", id: 799 },
    { sku: "AD-164942577", id: 2081 },
    { sku: "AD-157149419", id: 2063 },
    { sku: "AD-1480778", id: 2051 },
    { sku: "AD-1563658", id: 407 },
    { sku: "AD-153303193", id: 2083 },
    { sku: "AD-152327639", id: 2082 },
    { sku: "AD-4072643", id: 2064 },
    { sku: "AD-1930578", id: 2089 },
    { sku: "AD-1659821", id: 1589 },
    { sku: "AD-5725941", id: 1585 },
    { sku: "AD-164942645", id: 411 },
    { sku: "AD-164942636", id: 397 },
    { sku: "AD-164942648", id: 421 },
    { sku: "VD-159421168", id: 1951 },
    { sku: "VD-172887382", id: 1949 },
    { sku: "VD-156103106", id: 1953 },
    { sku: "VD-159328631", id: 1229 },
    { sku: "VD-159439897", id: 1393 },
    { sku: "VD-156284322", id: 521 },
    { sku: "VD-167450665", id: 1817 },
    { sku: "VD-171628988", id: 10001 },
    { sku: "VD-172225527", id: 1916 },

    { sku: "VD-169395951", id: 10045 },
    { sku: "VD-169525337", id: 10045 },

    { sku: "VD-172887378", id: 1950 },
    { sku: "VD-173508339", id: 1950 },

    { sku: "VD-159954172", id: 1405 },
    { sku: "VD-163010188", id: 1405 },

    { sku: "VD-159559869", id: 10031 },
    { sku: "VD-163118318", id: 10031 },

    { sku: "VD-30983803", id: 1413 },
    { sku: "VD-160083866", id: 1413 },

    { sku: "VD-168166007", id: 2004 },
    { sku: "VD-167821060", id: 1793 },
    { sku: "VD-167448996", id: 1533 },//20 e 22 01/2024
];

// await updateSkus('services_db_dev')
// await updateSkus('services_db')
const updateSkus = async (schema) => {
    for (let i = 0; i < arrayskus.length; i++) {
        const element = arrayskus[i];
        const query = `UPDATE ${schema}.wines SET skuVivino = '${element.sku}' WHERE id =  ${element.id}`;
        await executeUpdate(query);
    }
}

// const list = await createHistory('VD-');
// return handlerResponse(200, list, 'Vendas obtidas com sucesso')
const createHistory = async (skuContains) => {
    try {
        const { count, rows } = await WineSale.findAndCountAll({
            where: {
                sale: { [Op.like]: `%${skuContains}%` }
            },
            limit: 1000,
            order: [['id', 'ASC']],
        })

        let list = [];

        for (let i = 0; i < rows.length; i++) {
            const element = rows[i];
            const { saleFormatted, createdAt, updatedAt, companyId, saleDate } = element
            const { items, user, created_at, id } = saleFormatted
            for (let j = 0; j < items.length; j++) {
                const item = items[j];
                if (item.sku.includes(skuContains)) {
                    const wineSku = arrayskus.find(x => x.sku === item.sku)
                    if (!wineSku) {
                        const message = `${item.sku} NÃO ENCONTRADO`
                        console.error(message)
                        throw new Error(message);
                    }
                    const itemHistory = {
                        wineId: wineSku.id,
                        companyId,
                        dateReference: saleDate,
                        total: item.unit_count,
                        inventoryCountBefore: 0,
                        createdAt,
                        updatedAt,
                        sale: { wineId: wineSku.id, wineSku: item.sku, id, created_at, unit_count: item.unit_count, user },
                        dateReferenceGroup: new Date(saleDate).toISOString().split('T')[0],
                    }
                    list.push(itemHistory)
                }
            }
        }

        const itemsProductsGroupBySku = groupBy(list, 'dateReferenceGroup')
        var historyArr = []
        for (let i = 0; i < itemsProductsGroupBySku.length; i++) {
            const arrayGrouped = itemsProductsGroupBySku[i];
            const saleGroupBySku = groupBy(arrayGrouped, 'wineId')
            const productsSales = saleGroupBySku.map(list => {
                const [product] = list
                const sales = list.map(x => x.sale)
                return { ...product, total: sum(list, 'total'), sales: JSON.stringify(sales) }
            });
            productsSales.map(x => historyArr.push(x))
        }
        // await WineSaleHistory.bulkCreate(historyArr);

        return { count, historyArr };
    } catch (error) {
        return error
    }
}
//#endregion