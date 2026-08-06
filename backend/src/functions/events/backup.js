"use strict";

const { executeSelect } = require("../../services/ExecuteQueryService");
const s3 = require("../../services/AwsS3Service");
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");

module.exports.handler = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const { bucketPrivateName, DB_NAME } = process.env;
        const query = `SELECT table_name FROM information_schema.tables WHERE table_schema = '${DB_NAME}';`;
        const tables = await executeSelect(query);

        const formatValue = (value) => {
            if (value === null || value === undefined) return 'NULL';
            if (typeof value === 'number') return value;
            if (typeof value === 'boolean') return value ? 1 : 0;
            if (value instanceof Date) return `'${value.toISOString().slice(0, 19).replace('T', ' ')}'`;
            const stringValue = typeof value === 'object' ? JSON.stringify(value) : value.toString();
            return `'${stringValue.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
        };

        for (let i = 0; i < tables.length; i++) {
            const table = tables[i];
            const data = await executeSelect(`SELECT * FROM \`${table.TABLE_NAME}\``);

            let sql = `-- Backup da tabela ${table.TABLE_NAME}\n`;
            sql += `-- gerado em ${new Date().toISOString()}\n\n`;

            if (data.length === 0) {
                sql += `-- Nenhum registro encontrado para ${table.TABLE_NAME}\n`;
            } else {
                const columns = Object.keys(data[0]).map(column => `\`${column}\``).join(', ');
                data.forEach((row) => {
                    const values = Object.values(row).map(formatValue).join(', ');
                    sql += `INSERT INTO \`${table.TABLE_NAME}\` (${columns}) VALUES (${values});\n`;
                });
            }

            const result = await s3.put(sql, `backup/${table.TABLE_NAME}.sql`, bucketPrivateName);
            console.log(result);
        }

        return handlerResponse(200, { result: tables.map(x => x.TABLE_NAME) }, `Backup do banco ${DB_NAME} gerado com sucesso`)
    } catch (err) {
        return await handlerErrResponse(err)
    }
};