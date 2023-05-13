"use strict";

const db = require('../../database');
const WineSaleHistory = require('../../models/WineSaleHistory')(db.sequelize, db.Sequelize);
const { executeUpdate, executeSelect } = require("../../services/ExecuteQueryService");
const { sendMessage } = require('../../services/AwsQueueService')
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");

module.exports.handler = async (event) => {

    try {
        let result = null;

        if (event.Records)
            result = await readMessageRecursive(event.Records, 0);
        else if (!event.Records && event.body)
            result = await updateWine(JSON.parse(event.body));
        else
            messageInfo = 'Não existem mensagens pendentes de processamento na fila.'

        return handlerResponse(201, { result })
    }
    catch (err) {
        return handlerErrResponse(err)
    }
}

const readMessageRecursive = async (messages, position) => {
    try {
        const message = messages[position];
        const body = JSON.parse(message.body);

        console.log(`PROCESSANDO MENSAGEM ${position + 1} de ${messages.length}`);
        console.log(`MENSAGEM`, body);

        const result = await updateWine(body);

        position = position + 1
        if (messages.length > position)
            return await readMessageRecursive(messages, position);

        return result;
    } catch (error) {
        console.log('error ', error);
        throw new Error('Não foi possível executar este item da fila');
    }
}

const updateWine = async (body) => {
    const { companyId, dateReference, productsSales } = body
    try {

        console.log(`ATUALIZANDO VINHOS DA EMPRESA COD ${companyId} DATA ${dateReference}`, productsSales)

        let list = [];

        const ids = productsSales.map(x => Number(x.id || 0)).filter(x => x).join(',')
        const inventoryCountBeforeList = await executeSelect(`SELECT id, inventoryCount FROM wines WHERE companyId = '${companyId}' AND id IN (${ids})`)

        for (let i = 0; i < productsSales.length; i++) {
            const element = productsSales[i];

            const id = Number(element.id || 0)
            if (id) {
                const query = ` UPDATE wines 
                                    SET inventoryCount = inventoryCount - ${element.total}, updatedAt = NOW() 
                                WHERE companyId = '${companyId}' AND id =  ${id}`;
                await executeUpdate(query);

                const { inventoryCount } = inventoryCountBeforeList.find(x => x.id == id)

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

        return list;
    } catch (error) {
        console.log('error ', error);
        throw new Error(`Não foi possível executar este item da fila ${companyId}, ${dateReference}`);
    }
}