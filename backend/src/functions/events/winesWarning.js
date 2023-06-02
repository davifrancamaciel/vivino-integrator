"use strict";

const { Op } = require('sequelize');
const db = require('../../database');
const Wine = require('../../models/Wine')(db.sequelize, db.Sequelize);
const Company = require('../../models/Company')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { sendMessage } = require('../../services/AwsQueueService')
const xls = require("../../services/CreateXlsWinesService");
const { formatDateNameMonth } = require('../../utils/formatDate')

module.exports.handler = async (event) => {
    let resultS3 = {}
    try {

        const companies = await Company.findAll({
            attributes: ['id', 'name', 'email'],
            where: { vivinoApiIntegrationActive: true, active: true },
        })

        for (let i = 0; i < companies.length; i++) {
            const element = companies[i];
            const wines = await Wine.findAll({
                where: {
                    active: true,
                    companyId: element.id,
                    [Op.or]: {
                        inventoryCount: { [Op.lt]: 10 }, bottleQuantity: { [Op.lt]: 1 }
                    }
                },
                order: [['updatedAt', 'DESC'], ['inventoryCount', 'DESC']],
                attributes: ['id', 'productName', 'inventoryCount', 'updatedAt', 'link'],
            })

            if (wines && wines.length) {
                resultS3 = await xls.create(element.id, wines);
                const dateFormatted = formatDateNameMonth(new Date().toISOString());
                const companyName = element.name;
                const to = [element.email];
                const subject = `Relatório de vinhos com estoque baixo em ${dateFormatted}`
                const body = `  <div style='padding:50px'>
                                    <p>Olá, ${element.name}</p>
                                    <p>Segue o arquivo com os vinhos com estoque baixo em ${dateFormatted}</p>
                                    <p>Baixe o arquivo clicando <a href="${resultS3.Location}" target="_blank">aqui</a></p>
                                </div>`
                await sendMessage('send-email-queue', { to, subject, body, companyName });
            }
        }
        return handlerResponse(201, resultS3, `Relatórios de vinhos com estoque baixo criados com sucesso`)
    }
    catch (err) {
        return await handlerErrResponse(err)
    }
}