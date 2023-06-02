"use strict";

const db = require('../../database');
const { executeSelect } = require("../../services/ExecuteQueryService");
const { format, subMonths, startOfMonth, endOfMonth } = require('date-fns');
const pt = require('date-fns/locale/pt');
const Expense = require('../../models/Expense')(db.sequelize, db.Sequelize);

const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const formatPrice = require("../../utils/formatPrice");
const { sendMessage } = require('../../services/AwsQueueService')


module.exports.handler = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        let date = subMonths(new Date(), 1);

        const { queryStringParameters } = event
        if (queryStringParameters)
            date = new Date(queryStringParameters.dateReference)

        const query = ` SELECT u.id, u.name, u.commissionMonth, u.companyId, u.email, c.name companyName, 
                            (SELECT SUM(s.value) FROM sales s WHERE s.companyId = u.companyId AND s.createdAt BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}') totalValueMonth,
                            (SELECT COUNT(sc.id) FROM sales sc WHERE sc.companyId = u.companyId AND sc.createdAt BETWEEN '${startOfMonth(date).toISOString()}' AND '${endOfMonth(date).toISOString()}') count
                        FROM users u 
                        INNER JOIN companies c ON c.id = u.companyId
                        WHERE u.commissionMonth > 0 AND c.active = 1`;
        const result = await executeSelect(query);

        let expenses = []
        result.forEach(element => {

            const value = Number(element.totalValueMonth) * (Number(element.commissionMonth) / 100);
            const dateReference = format(date, "'mês' 'de' MMMM 'de' yyyy", {
                locale: pt,
            });
            const title = `Comissão referente ao ${dateReference} de ${element.name}`
            const description = `${title} sob a quantidade de ${element.count} vendas, valor total ${formatPrice(element.totalValueMonth)} gerando o valor de comissão R$ ${formatPrice(value)} (${element.commissionMonth}%) sob o valor total de vendas no mês.`;

            const item = {
                expenseTypeId: 1,
                dividedIn: 1,
                paidOut: false,
                paymentDate: new Date(),
                userId: element.id,
                companyId: element.companyId,
                value,
                title,
                description,
                name: element.name,
                email: element.email,
                companyName: element.companyName
            }
            if (value)
                expenses.push(item)
        });
        await Expense.bulkCreate(expenses);

        for (let i = 0; i < expenses.length; i++) {
            const element = expenses[i];

            const companyName = element.companyName;
            // const to = [element.email]
            const to = ['davifrancamaciel@gmail.com']
            const subject = element.title.replace(` de ${element.name}`, '')
            const body = `  <div style='padding:50px'>
                                <p>Olá, ${element.name}</p>
                                <p>${element.description.replace(` de ${element.name}`, '')}</p>                                
                            </div>`
            await sendMessage('send-email-queue', { to, subject, body, companyName });
        }

        return handlerResponse(200, { expenses, result }, 'Comissões geradas com sucesso')
    } catch (err) {
        return await handlerErrResponse(err)
    }
};