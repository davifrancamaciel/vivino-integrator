
"use strict";

const axios = require('axios');
const FormData = require('form-data');
const db = require('../../database');
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const WineSale = require('../../models/WineSale')(db.sequelize, db.Sequelize);
const Wine = require('../../models/Wine')(db.sequelize, db.Sequelize);
const { executeUpdate, executeSelect } = require("../../services/ExecuteQueryService");
const { sendMessage } = require('../../services/AwsQueueService')
const UserClientWineService = require('../../services/UserClientWineService')
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { linkServices, linkVivino, companyIdDefault } = require("../../utils/defaultValues");
const { getVivinoUrl } = require("../../utils");
// const { seeds, importImages } = require('../../services/WinesImport');
// const { handler } = require('../queue/sendWhatsapp')

module.exports.auth = async (event, context) => {

    // if (process.env.IS_OFFLINE) {
    //     const importacao = await importImages();
    //     return handlerResponse(200, importacao);
    //     // return handlerResponse(200, await handler(event));
    // }

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

        const { queryStringParameters } = event
        if (queryStringParameters)
            dateReference = queryStringParameters.dateReference

        const resp = await Company.findAll({
            attributes: ['id', 'name', 'vivinoId', 'vivinoAuthToken', 'vivinoClientId'],
            where: { vivinoApiIntegrationActive: true, active: true },
        })

        let response = null, queueObj = null, salesBeforeImported = [], salesImportedNow = [];

        for (let i = 0; i < resp.length; i++) {
            let itemsProducts = [], sales = [];
            const element = resp[i];
            companyId = element.id;

            const data = await getVivinoSales(companyId, dateReference, element);
            if (!data)
                continue;

            response = data;
            const codes = data.map(x => x.id).join(`','`)
            const query = `SELECT code FROM wineSales WHERE companyId = '${companyId}' AND code IN ('${codes}')`
            const salesIsExist = await executeSelect(query);

            data.forEach(element => {
                const { items, id, created_at, user, confirmed_at } = element;

                if (!salesIsExist.find(x => x.code === id)) {
                    salesImportedNow.push(`${id}`);

                    sales.push({
                        companyId,
                        code: id,
                        value: element.items_total_sum,
                        sale: JSON.stringify(createSale(element)),
                        saleDate: new Date(created_at)
                    });

                    items && items.forEach(elementItem => itemsProducts.push({
                        sale: { id, created_at, unit_count: elementItem.unit_count, user }, ...elementItem
                    }));
                } else
                    salesBeforeImported.push(`${id}`);
            });

            const { productsSales, skusNotFoundArray } = await identifyWinesBySkuOrNameAndVintage(companyId, itemsProducts);
            const itemsProductsGroupById = groupBy(productsSales, 'id')
            const productsSalesGrouped = itemsProductsGroupById.map(list => {
                const [wine] = list;
                let sales = [];
                list.forEach(elementList => elementList.sales.forEach(elementSales => sales.push(elementSales)));
                return { id: wine.id, total: sum(list, 'total'), sales }
            });

            console.log(data);
            console.log(`${data?.length} VENDAS ENCONTRADAS`);
            console.log(`${sales?.length} VENDAS SERÃO CADASTRADAS -> ${salesImportedNow.join(`','`)}`)
            console.warn(`VENDAS IMPORTADAS ANTERIORMENTE ${salesBeforeImported.join(`','`)}`)

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

        return handlerResponse(200, { queueObj, response }, `${response.length} vendas obtidas com sucesso, ${queueObj.productsSales.length} cadastradas`)
    } catch (err) {
        const message = `ERRO AO BUSCAR VENDAS EMPRESA COD ${companyId} NA API VIVINO DATA ${dateReference}`
        return await handlerErrResponse(err, null, message)
    }
};

const getVivinoSales = async (companyId, dateReference, element) => {
    const status = 'Confirmed', limit = 2000;
    console.log(`BUSCANDO VENDAS DA EMPRESA ${element.name} COD ${companyId} NA API VIVINO DATA ${dateReference}`)

    const config = {
        method: 'GET',
        maxBodyLength: Infinity,
        url: `${getVivinoUrl(element.vivinoClientId)}/merchants/${element.vivinoId}/purchase_orders/_active?app_version=8.19&status=${status}&limit=${limit}&start_date=${dateReference}&end_date=${dateReference}`,
        headers: { 'Authorization': `Bearer ${element.vivinoAuthToken}` }
    };

    const { data } = await axios(config);
    return data;
}

const createSale = (element) => {
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
    return sale;
}

const identifyWinesBySkuOrNameAndVintage = async (companyId, itemsProducts) => {

    let idsBySkus = [];
    const itemsProductsGroupBySku = groupBy(itemsProducts, 'sku')
    const skus = itemsProductsGroupBySku.map(list => {
        const [product] = list
        return product.sku;
    }).filter(x => x.includes('-')).join("','");
    if (skus)
        idsBySkus = await executeSelect(`SELECT id, skuVivino FROM wines WHERE companyId = '${companyId}' AND skuVivino IN ('${skus}')`)

    let productsSales = [], skusNotFoundArray = []
    for (let i = 0; i < itemsProductsGroupBySku.length; i++) {
        const list = itemsProductsGroupBySku[i];
        const [product] = list
        const sales = list.map(x => x.sale)
        let wineId = 0;
        if (!product.sku.includes('-'))
            wineId = Number(product.sku)
        else {
            const wineIdFound = await getIdWine(companyId, product, idsBySkus)
            if (wineIdFound)
                wineId = wineIdFound;
            else
                skusNotFoundArray.push(createLink(companyId, product));
        }
        productsSales.push({ id: wineId, total: sum(list, 'unit_count'), sales })
    }
    return { productsSales, skusNotFoundArray };
}

const getIdWine = async (companyId, product, idsBySkus) => {

    const wineIdFound = idsBySkus.find(x => x.skuVivino === product.sku);
    if (wineIdFound)
        return wineIdFound.id;

    let arrayName = product.description.split(' ');
    const vintage = arrayName.pop();
    const productName = arrayName.join(' ');
    const wine = await Wine.findOne({
        where: { companyId, productName, vintage },
        attibutes: ['id'],
    })
    if (wine) {
        await wine.update({ skuVivino: product.sku })
        return wine.id
    }

    return 0;
}

const createLink = (companyId, product) => {
    const { STAGE } = process.env
    const link = companyId === companyIdDefault && STAGE === 'prd' ? linkVivino : linkServices;
    const skuLink = `<a href="${link}/wines/sales?sale=${product.sku}" target="_blank"><b>${product.sku} -> ${product.description}</b></a>`
    return `<p>${skuLink}</p>`;
}

const sendWarningSkuNotFound = async (skusNotFoundArray, companyId) => {

    const skusNotFound = skusNotFoundArray?.join(' ');

    if (skusNotFound) {
        const [company] = await executeSelect(`SELECT name, email FROM companies WHERE id = '${companyId}'`)
        const subject = `ATENÇÃO! ${company.name}, os seguintes SKUs não foram encontrados`
        const to = [process.env.EMAIL_FROM_SENDER, company.email];
        const body = `<div style='padding:50px'>
                        <p>Integrador Vivino informa</p>                        
                        <p>ATENÇÃO! Os seguintes SKUs abaixo não foram encontrados</p>                        
                        ${skusNotFound}                        
                        <p>Faça a associação no cadastro do vinho correspondente pois a falta deste mapeamento resulta na NÂO baixa no controle de estoque e contabilização dos vinhos vendidos</p>                        
                      </div>`;

        await sendMessage('send-email-queue', { to, subject, body, companyName: company.name });
    }
}

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