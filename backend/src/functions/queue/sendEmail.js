"use strict";

const { sendEmailMessage } = require('../../services/AwsSendMailService')
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { readMessageRecursive } = require("./_baseQueue");

module.exports.handler = async (event) => {
    try {
        let result = null;

        if (event.Records)
            result = await readMessageRecursive(event.Records, 0, send);
        else
            messageInfo = 'Não existem mensagens pendentes de processamento na fila.'

        return handlerResponse(201, { result })
    }
    catch (err) {
        return await handlerErrResponse(err)
    }
}

const send = async (message) => {
    try {
        const { to, subject, body, companyName } = message

        console.log(`ENVIO DE EMAIL VIA SES DATA ${new Date().toISOString()}`)
        console.log(`ASSUNTO ${subject} DE ${companyName} PARA ${to}`)

        const result = await sendEmailMessage({ to, subject, body, companyName })
        console.log(result)
        return result;
    } catch (error) {
        console.log('error ', error);
        throw new Error(`Não foi possível executar este item da fila`);
    }
}