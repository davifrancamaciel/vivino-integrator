"use strict";

const uuid = require('uuid');
const s3 = require("./AwsS3Service");
const { executeUpdate } = require("./ExecuteQueryService");

const add = async (table, obj, fileList) => {
    if (fileList && fileList.length) {

        let { companyId, id, image } = obj;
        if (table === 'companies')
            companyId = id

        const [file] = fileList;
        if (file && file.preview) {

            const fileArr = file.name.split('.');
            const filename = `${id}_${uuid.v4()}.${fileArr[fileArr.length - 1]}`;

            const { bucketPublicName } = process.env
            let key = `${companyId}/${table}/${id}/${filename}`;

            if (table === 'companies')
                key = `${companyId}/logo-${filename}`;

            var buf = Buffer.from(file.preview.replace(/^data:image\/\w+;base64,/, ""), 'base64')
            const result = await s3.put(buf, key, bucketPublicName, file.type, 'base64');

            let query = `UPDATE ${table} SET image = '${result.Location}', updatedAt = NOW() WHERE`;
            if (table === 'companies')
                query = `${query} id = '${companyId}'`
            else
                query = `${query} id = ${id} AND companyId = '${companyId}'`

            await executeUpdate(query);

            await remove(image);
        }
    }
}

const remove = async (image) => {
    const { bucketPublicName } = process.env
    if (image && image.includes(bucketPublicName)) {
        const key = image.replace(`https://${bucketPublicName}.s3.amazonaws.com/`, '')
        await s3.remove(key, bucketPublicName);
    }
}

module.exports = { add, remove }