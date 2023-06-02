"use strict";

const { executeSelect } = require("../../services/ExecuteQueryService");
const s3 = require("../../services/AwsS3Service");
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");

module.exports.handler = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const { bucketName, DB_NAME } = process.env;
        const query = `SELECT table_name FROM information_schema.tables WHERE table_schema = '${DB_NAME}';`;
        const tables = await executeSelect(query);

        for (let i = 0; i < tables.length; i++) {
            const table = tables[i];
            const data = await executeSelect(`SELECT * FROM ${table.TABLE_NAME}`);

            const result = await s3.put(JSON.stringify(data), `backup/${table.TABLE_NAME}.json`, bucketName);
            console.log(result);
        }

        return handlerResponse(200, { result: tables.map(x => x.TABLE_NAME) }, `Backup do banco ${DB_NAME} gerado com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err)
    }
};