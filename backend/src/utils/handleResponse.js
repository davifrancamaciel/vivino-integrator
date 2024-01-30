"use strict";

const onError = require("./errorLib");
const { sendMessage } = require('../services/AwsQueueService')

const handlerResponse = (statusCode, body, message = 'Dados obtidos com sucesso') => {
    let response = {
        statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
        }
    }

    if (body) {
        const result = { success: statusCode < 300, message, data: body }
        response['body'] = JSON.stringify(result)
    }

    return response
}

const handlerErrResponse = async (err, obj, msg) => {
    console.error('handlerErrResponse', err, obj, msg)
    let message = err.message ? err.message : "Unknown error";
    const errAWS = onError(err)
    if (errAWS) message = errAWS
    // if (message.includes('CONSTRAINT')) {
    //     message = 'Este intem não poderá ser removido pois está vinculado como chave em outra tabela'
    // }
    if (msg) message = msg
    const body = { error: err.name ? err.name : "Exception", err, obj }

    if (!process.env.IS_OFFLINE)
        await sendMailError(err, message)

    return handlerResponse(err.statusCode ? err.statusCode : 500, body, message)
}

const sendMailError = async (err, message) => {
    const subject = message
    const to = [process.env.EMAIL_FROM_SENDER];
    const body = `<div style='padding:50px'>
                    <p>${message}</p>
                    <p>${err?.name}</p>
                    <p>${err?.table}</p>
                    <p>${err?.message}</p>
                  </div>`;

    await sendMessage('send-email-queue', { to, subject, body });
}

module.exports = { handlerResponse, handlerErrResponse }

