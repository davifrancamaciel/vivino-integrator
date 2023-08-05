"use strict";

const AWS = require('aws-sdk')
AWS.config.update({
    region: process.env.REGION
})

const s3 = new AWS.S3();

const get = async (objectKey, bucket) => {
    if (!objectKey || !bucket)
        throw new Error("Os parametros não foram informados corretamente");

    const key = decodeURIComponent(objectKey.replace(/\+/g, ' '));
    const params = { Bucket: bucket, Key: key };

    return await s3.getObject(params).promise();
}

const put = async (object, objectKey, bucket, contentType, contentEncoding) => {
    const params = {
        Bucket: bucket,
        Key: objectKey,
        Body: object,
        //ContentType: mimeType//geralmente se acha sozinho
    };

    if (contentType)
        params.ContentType = contentType;
    if (contentEncoding)
        params.ContentEncoding = contentEncoding;

    const result = await s3.upload(params).promise();
    console.log(result);
    return result;
}

const remove = async (objectKey, bucket) => {
    if (!objectKey || !bucket)
        throw new Error("Os parametros não foram informados corretamente");

    const key = decodeURIComponent(objectKey.replace(/\+/g, ' '));
    const params = { Bucket: bucket, Key: key };
    const result = await s3.deleteObject(params).promise();
    console.log(result);
    return result;
}

module.exports = { get, put, remove }