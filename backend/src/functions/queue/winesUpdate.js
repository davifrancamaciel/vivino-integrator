"use strict";

const db = require('../../database');
const WineSaleHistory = require('../../models/WineSaleHistory')(db.sequelize, db.Sequelize);
const { executeUpdate, executeSelect } = require("../../services/ExecuteQueryService");
const { sendMessage } = require('../../services/AwsQueueService')
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { readMessageRecursive } = require("./_baseQueue");

module.exports.handler = async (event) => {

    try {
        let result = null;

        if (event.Records)
            result = await readMessageRecursive(event.Records, 0, updateWine);
        else if (!event.Records && event.body)
            result = await updateWine(JSON.parse(event.body));
        else
            messageInfo = 'Não existem mensagens pendentes de processamento na fila.'

        return handlerResponse(201, { result })
    }
    catch (err) {
        return await handlerErrResponse(err)
    }
}

const updateWine = async (body) => {
    let { companyId, dateReference, productsSales } = body
    try {
        if (!productsSales.length)
            return 'Não ha produtos nesta fila';

        console.log(`ATUALIZANDO VINHOS DA EMPRESA COD ${companyId} DATA ${dateReference}`, productsSales)

        let list = [];

        const ids = productsSales.map(x => Number(x.id || 0)).filter(x => x).join(',')
        const inventoryCountBeforeList = await executeSelect(`SELECT id, inventoryCount FROM wines WHERE companyId = '${companyId}' AND id IN (${ids ? ids : 0})`)

        let inventoryCountBeforeSkuList = [];
        const skus = productsSales.map(x => x.id).filter(x => x.includes('-')).join("','");
        if (skus) {
            inventoryCountBeforeSkuList = await executeSelect(`SELECT id, skuVivino, inventoryCount FROM wines WHERE companyId = '${companyId}' AND skuVivino IN ('${skus}')`)

            if (inventoryCountBeforeSkuList.length) {
                productsSales = productsSales.map(wine => {
                    const wineBySku = inventoryCountBeforeSkuList.find(x => x.skuVivino === wine.id)
                    return wineBySku ? { ...wine, id: wineBySku.id } : wine
                })
            }
        }

        for (let i = 0; i < productsSales.length; i++) {
            const element = productsSales[i];

            const id = Number(element.id || 0)
            if (id) {
                const query = ` UPDATE wines 
                                    SET inventoryCount = inventoryCount - ${element.total}, updatedAt = NOW() 
                                WHERE companyId = '${companyId}' AND id =  ${id}`;
                await executeUpdate(query);

                let inventoryCount = 0
                const inventoryCountById = inventoryCountBeforeList.find(x => x.id == id);
                if (inventoryCountById)
                    inventoryCount = inventoryCountById.inventoryCount;
                else {
                    const inventoryCountBySku = inventoryCountBeforeSkuList.find(x => x.id == id);
                    if (inventoryCountBySku)
                        inventoryCount = inventoryCountBySku.inventoryCount;
                }

                const itemHistory = {
                    wineId: id,
                    companyId,
                    dateReference,
                    total: element.total,
                    inventoryCountBefore: inventoryCount,
                    sales: JSON.stringify(element.sales)
                }
                list.push(itemHistory)
            }
        }

        await WineSaleHistory.bulkCreate(list);

        await sendMessage('wines-xml-generate-files-queue', {
            companyId,
            userId: 'AWS_EVENT_BRIDGE',
            wine: list.map(x => x.wineId),
            type: 'UPDATE_BY_SALES_VIVINO'
        });

        await sendWarningSkuNotFound(productsSales, companyId);

        return list;
    } catch (error) {
        console.log('error ', error);
        throw new Error(`[Não foi possível executar este item da fila ${companyId}], [${dateReference}] [${error.message}] [${error.stack}]`);
    }
}

const sendWarningSkuNotFound = async (productsSales, companyId) => {

    const skusNotFound = productsSales.map(x => `${x.id}`).filter(x => x.includes('-'))?.join("', '");

    if (skusNotFound) {
        const [company] = await executeSelect(`SELECT name, email FROM companies WHERE id = '${companyId}'`)
        const subject = `ATENÇÃO! ${company.name}, os seguintes SKUs não foram encontrados`
        const to = ['davifrancamaciel@gmail.com', company.email];
        const body = `<div style='padding:50px'>
                        <p>Integrador Vivino informa</p>                        
                        <p>ATENÇÃO! Os seguintes SKUs abaixo não foram encontrados</p>                        
                        <p><b>'${skusNotFound}'</b></p>                        
                        <p>Faça a associação no cadastro do vinho correspondente pois a falta deste mapeamento resulta na NÂO baixa no controle de estoque e contabilização dos vinhos vendidos</p>                        
                      </div>`;

        await sendMessage('send-email-queue', { to, subject, body, companyName: company.name });
    }
}