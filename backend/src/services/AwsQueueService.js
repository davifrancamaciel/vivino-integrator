"use strict";

const AWS = require('aws-sdk')
AWS.config.update({
    region: process.env.REGION
})

const sqs = new AWS.SQS();

const sendMessage = async (QueueUrl, body) => {
    try {
        const MessageBody = JSON.stringify(body)
        const result = await sqs.sendMessage({ QueueUrl, MessageBody }).promise();
        console.log('ENVIO DE MENSAGEM SQS ', MessageBody, result)
        return result;
    } catch (error) {
        console.error('erro sendMessage', error)
        return error;
    }
}

const receiveMessage = async (QueueUrl) => {
    console.log('RECER MENSAGEM', QueueUrl)
    try {
        return await sqs.receiveMessage({
            QueueUrl,
            MaxNumberOfMessages: 10,
            WaitTimeSeconds: 5
        }).promise();
    } catch (error) {
        console.error('erro receiveMessage', error)
        return error;
    }
}

const deleteMessage = async (QueueUrl, message) => {
    try {
        return await sqs.deleteMessage({ QueueUrl, ReceiptHandle: message.receiptHandle }).promise();
    } catch (error) {
        console.error('erro deleteMessage', error)
        return error;
    }
}
module.exports = { sendMessage, receiveMessage, deleteMessage }