"use strict";

const readMessageRecursive = async (messages, position, callback) => {
    try {
        const message = messages[position];
        const body = JSON.parse(message.body);

        console.log(`readMessageRecursive PROCESSANDO MENSAGEM ${position + 1} de ${messages.length}`);
        console.log(`MENSAGEM`, body);

        const result = await callback(body);

        position = position + 1
        if (messages.length > position)
            return await readMessageRecursive(messages, position, callback);

        return result;
    } catch (error) {
        console.log('error ', error);
        throw new Error('readMessageRecursive Não foi possível executar este item da fila');
    }
}

module.exports = { readMessageRecursive }