"use strict";

const db = require('../../database');
const { format, subMonths, endOfMonth, subHours } = require('date-fns');
const pt = require('date-fns/locale/pt');
const Expense = require('../../models/Expense')(db.sequelize, db.Sequelize);
const salesRepository = require('../../repositories/salesRepository');

const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const formatPrice = require("../../utils/formatPrice");
const { sendMessage } = require('../../services/AwsQueueService')
const { linkServices } = require("../../utils/defaultValues");

module.exports.handler = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        let date = subMonths(new Date(), 0);

        const { queryStringParameters } = event
        if (queryStringParameters)
            date = new Date(queryStringParameters.dateReference);

        const result = await salesRepository.salesMonthExpenseCommission(date);

        let expenses = []
        result.forEach(element => {

            let count = Number(element.count);
            let value = Number(element.totalValueCommissionMonth);
            let totalValueMonth = Number(element.totalValueMonth);

            if (!element.individualCommission) {
                const sales = result.filter(x => x.companyId === element.companyId);
                count = sum(sales, 'count');
                value = sum(sales, 'totalValueCommissionMonth') / element.users;
                totalValueMonth = sum(sales, 'totalValueMonth');
            }

            const dateReference = format(date, "'mês' 'de' MMMM 'de' yyyy", { locale: pt });
            const title = `Comissão referente ao ${dateReference} de ${element.name}`
            const description = `${title} sob a quantidade de ${count} vendas, valor total ${formatPrice(totalValueMonth)} gerando o valor de comissão ${formatPrice(value)} (${element.commissionMonth}%) sob o valor total de vendas no mês.`;

            const item = {
                expenseTypeId: 1,
                dividedIn: 1,
                paidOut: false,
                paymentDate: subHours(endOfMonth(date), 4),
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

        await sendEmails(expenses);

        return handlerResponse(200, { expenses, result }, 'Comissões geradas com sucesso')
    } catch (err) {
        return await handlerErrResponse(err)
    }
};

const sendEmails = async (expenses) => {
    const { STAGE } = process.env;
    const link = linkServices;
    const emailAdm = process.env.EMAIL_FROM_SENDER;

    for (let i = 0; i < expenses.length; i++) {
        const element = expenses[i];

        const companyName = element.companyName;
        const to = STAGE === 'dev' ? [emailAdm] : [emailAdm, element.email]
        const subject = element.title.replace(` de ${element.name}`, '')
        const body = `  <div style='padding:50px'>
                            <p>Olá, ${element.name}</p>
                            <p>${element.description.replace(` de ${element.name}`, '')}</p> 
                            <p>Clique <a href="${link}/sales/my-commisions" target="_blank">aqui</a> e veja todas as comissões</p>                               
                        </div>`
        await sendMessage('send-email-queue', { to, subject, body, companyName });
    }
}

const sum = function (items, prop) {
    return items.reduce(function (a, b) {
        return Number(a) + Number(b[prop]);
    }, 0);
};