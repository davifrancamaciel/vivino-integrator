"use strict";

const s3 = require("../services/AwsS3Service");
const { handlerResponse, handlerErrResponse } = require("../utils/handleResponse");

module.exports.handler = async (event) => {
    const { bucketName } = process.env
    const key = 'vivinofeed.xml '
    try {
        await s3.remove(key, bucketName);

        const fileStream = ''
        const result = await s3.put(fileStream, key, bucketName);
        return handlerResponse(201, result)
    }
    catch (err) {
        return handlerErrResponse(err)
    }
}