"use strict";

const AWS = require('aws-sdk')
AWS.config.update({
    region: process.env.REGION
})

const sqs = new AWS.SQS();

const sendMessage = async (queue, body) => {
    try {
        const MessageBody = JSON.stringify(body)
        console.log('ENVIO DE MENSAGEM SQS ', { queue: `${process.env.SQS_URL}-${queue}`, MessageBody })
        const result = await sqs.sendMessage({
            QueueUrl: `${process.env.SQS_URL}-${queue}`,
            MessageBody
        }).promise();
        console.log('MENSAGEM SQS ENVIADA', result)
        return result;
    } catch (error) {
        console.error('erro sendMessage', error)
        return error;
    }
}

const receiveMessage = async (queue) => {
    console.log('RECER MENSAGEM', queue)
    try {
        return await sqs.receiveMessage({
            QueueUrl: `${process.env.SQS_URL}-${queue}`,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 5
        }).promise();
    } catch (error) {
        console.error('erro receiveMessage', error)
        return error;
    }
}

const deleteMessage = async (queue, message) => {
    try {
        return await sqs.deleteMessage({
            QueueUrl: `${process.env.SQS_URL}-${queue}`,
            ReceiptHandle: message.receiptHandle
        }).promise();
    } catch (error) {
        console.error('erro deleteMessage', error)
        return error;
    }
}
module.exports = { sendMessage, receiveMessage, deleteMessage }