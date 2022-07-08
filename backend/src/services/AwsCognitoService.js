"use strict";

const https = require('https')
const CognitoIdentityServiceProvider = require("aws-sdk/clients/cognitoidentityserviceprovider");

const cognitoRequest = async (method, params) => {
    const requestParams = {
        UserPoolId: getUserPooId(),
        ...params
    };

    const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
    return await cognitoIdentityServiceProvider[method](requestParams).promise();
    return await cognitoIdentityServiceProvider.listUsersInGroup(requestParams).promise();
}

const getKeys = async () => {
    const userPoolId = getUserPooId();
    const url = `https://cognito-idp.${process.env.REGION}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
    return new Promise((resolve, reject) => {
        const req = https.get(url, res => {
            let rawData = '';

            res.on('data', chunk => {
                rawData += chunk;
            });

            res.on('end', () => {
                try {
                    resolve(JSON.parse(rawData));
                } catch (err) {
                    reject(new Error(err));
                }
            });
        });

        req.on('error', err => {
            reject(new Error(err));
        });
    });
}
const getUserPooId = () => !process.env.IS_OFFLINE ? process.env.USER_POO_ID : process.env.USER_POO_ID_OFFLINE;

module.exports = { cognitoRequest, getKeys }