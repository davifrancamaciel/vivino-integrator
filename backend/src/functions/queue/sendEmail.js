"use strict";

const { sendEmailMessage } = require('../../services/AwsSendMailService')
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");

module.exports.handler = async (event) => {
    try {
        let result = null;

        if (event.Records)
            result = await readMessageRecursive(event.Records, 0);
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

        const result = await send(body);

        position = position + 1
        if (messages.length > position)
            return await readMessageRecursive(messages, position);

        return result;
    } catch (error) {
        console.log('error ', error);
        throw new Error('Não foi possível executar este item da fila');
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