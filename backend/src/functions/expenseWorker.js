"use strict";

const { Op } = require('sequelize');
const { startOfDay, endOfDay, parseISO, addDays } = require('date-fns');
const db = require('../database');
const ExpenseType = require('../models/ExpenseType')(db.sequelize, db.Sequelize);
const Expense = require('../models/Expense')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../utils/handleResponse");
const { sendMessage } = require('../services/AwsQueueService')

module.exports.handler = async (event, context) => {
    try {

        const date = new Date()
        const paymentDateStart = date
        const paymentDateEnd = addDays(date, 4)
        const resp = await Expense.findAll({
            where: {
                paymentDate: {
                    [Op.between]: [startOfDay(paymentDateStart), endOfDay(paymentDateEnd),]
                },
                paidOut: false,
            },
            include: [
                {
                    model: ExpenseType,
                    as: 'expenseTypes',
                    attributes: ['name'],
                }
            ]
        })
        const QUEUE_URL = `${process.env.SQS_URL}-expenses`
        // await sendMessage(QUEUE_URL, resp)
        return handlerResponse(200, resp)
    } catch (err) {
        return handlerErrResponse(err)
    }
};
