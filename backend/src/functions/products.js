"use strict";

const AWS = require("aws-sdk");
const { handlerResponse, handlerErrResponse } = require("../utils/handleResponse");
const { getUser } = require("../services/UserService");

const RESOURCE_NAME = 'Vinho'

const dynamodb = new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: process.env.PRODUCTS_TABLE,
};

module.exports.list = async (event, context) => {
    try {
        context.callbackWaitsForEmptyEventLoop = false;

        let whereStatementExpressionAttributeValues = undefined,
            whereStatementFilterExpression = undefined,
            whereStatementExpressionAttributeNames = undefined;

        const queryString = {
            limit: 100,
            ...event.queryStringParameters,
        };
        const { limit, next, productId, productName, producer, wineName } = queryString;

        if (productId) {
            whereStatementExpressionAttributeValues = { ":productId_val": `${productId}` }
            whereStatementFilterExpression = "#productId = :productId_val"
            whereStatementExpressionAttributeNames = { "#productId": "productId", }
        }

        let localParams = {
            ...params,
            Limit: limit,
            FilterExpression: whereStatementFilterExpression,
            ExpressionAttributeNames: whereStatementExpressionAttributeNames,
            ExpressionAttributeValues: whereStatementExpressionAttributeValues
        };  

        if (next) {
            localParams.ExclusiveStartKey = {
                productId: next,
            };
        }
        let data = await dynamodb.scan(localParams).promise();

        let nextToken =
            data.LastEvaluatedKey != undefined
                ? data.LastEvaluatedKey.productId
                : null;

        const result = {
            items: data.Items,
            next_token: nextToken,
        };

        return handlerResponse(200, { count: data.Count, rows: result.items, result })

    } catch (err) {
        return handlerErrResponse(err)
    }
};

module.exports.listById = async (event) => {
    const { pathParameters } = event
    try {
        const result = await dynamodb.get({ ...params, Key: { productId: pathParameters.id }, }).promise();

        if (!result)
            return handlerResponse(400, {}, `${RESOURCE_NAME} não encontrado`)

        return handlerResponse(200, result.Item)
    } catch (err) {
        return handlerErrResponse(err, pathParameters)
    }
}

module.exports.create = async (event) => {
    const body = JSON.parse(event.body)
    try {

        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!user.havePermissionApprover)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const timestamp = new Date().getTime();

        const product = {
            ...body,
            createdAt: timestamp,
            updatedAt: timestamp,
        };

        const result = await dynamodb.put({ ...params, Item: product }).promise();
        return handlerResponse(201, result, `${RESOURCE_NAME} criado com sucesso`)
    } catch (err) {
        return handlerErrResponse(err, body)
    }
}

module.exports.update = async (event) => {
    const body = JSON.parse(event.body)
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!user.havePermissionApprover)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const {
            productId,
            productName,
            price,
            quantityIsMinimum,
            bottleSize,
            bottleQuantity,
            link,
            inventoryCount,
            producer,
            wineName,
            appellation,
            vintage,
            country,
            color,
            image,
            ean,
            description,
            alcohol,
            producerAddress,
            importerAddress,
            varietal,
            ageing,
            closure,
            winemaker,
            productionSize,
            residualSugar,
            acidity,
            ph,
            containsMilkAllergens,
            containsEggAllergens,
            nonAlcoholic,
            active,
        } = body
        const timestamp = new Date().getTime();
        await dynamodb
            .update({
                ...params, Key: { productId },
                UpdateExpression:
                    `SET                     
                        productName = :productName,
                        price = :price,
                        quantityIsMinimum = :quantityIsMinimum,
                        bottleSize = :bottleSize,
                        bottleQuantity = :bottleQuantity,
                        link = :link,
                        inventoryCount = :inventoryCount,
                        producer = :producer,
                        wineName = :wineName,
                        appellation = :appellation,
                        vintage = :vintage,
                        country = :country,
                        color = :color,
                        image = :image,
                        ean = :ean,
                        description = :description,
                        alcohol = :alcohol,
                        producerAddress = :producerAddress,
                        importerAddress = :importerAddress,
                        varietal = :varietal,
                        ageing = :ageing,
                        closure = :closure,
                        winemaker = :winemaker,
                        productionSize = :productionSize,
                        residualSugar = :residualSugar,
                        acidity = :acidity,
                        ph = :ph,
                        containsMilkAllergens = :containsMilkAllergens,
                        containsEggAllergens = :containsEggAllergens,
                        nonAlcoholic = :nonAlcoholic,
                        active = :active,
                        updatedAt = :updatedAt`
                ,
                ConditionExpression: "attribute_exists(productId)",
                ExpressionAttributeValues: {
                    ":productName": valueVerify(productName),
                    ":price": valueVerify(price),
                    ":quantityIsMinimum": valueVerify(quantityIsMinimum),
                    ":bottleSize": valueVerify(bottleSize),
                    ":bottleQuantity": valueVerify(bottleQuantity),
                    ":link": valueVerify(link),
                    ":inventoryCount": valueVerify(inventoryCount),
                    ":producer": valueVerify(producer),
                    ":wineName": valueVerify(wineName),
                    ":appellation": valueVerify(appellation),
                    ":vintage": valueVerify(vintage),
                    ":country": valueVerify(country),
                    ":color": valueVerify(color),
                    ":image": valueVerify(image),
                    ":ean": valueVerify(ean),
                    ":description": valueVerify(description),
                    ":alcohol": valueVerify(alcohol),
                    ":producerAddress": valueVerify(producerAddress),
                    ":importerAddress": valueVerify(importerAddress),
                    ":varietal": valueVerify(varietal),
                    ":ageing": valueVerify(ageing),
                    ":closure": valueVerify(closure),
                    ":winemaker": valueVerify(winemaker),
                    ":productionSize": valueVerify(productionSize),
                    ":residualSugar": valueVerify(residualSugar),
                    ":acidity": valueVerify(acidity),
                    ":ph": valueVerify(ph),
                    ":containsMilkAllergens": containsMilkAllergens,
                    ":containsEggAllergens": containsEggAllergens,
                    ":nonAlcoholic": nonAlcoholic,
                    ":active": active,
                    ":updatedAt": timestamp
                },
            })
            .promise();
        return handlerResponse(200, {}, `${RESOURCE_NAME} alterado com sucesso`)
    } catch (err) {
        return handlerErrResponse(err, body)
    }
}

const valueVerify = (value) => {
    return value ? value : null
}

module.exports.delete = async (event) => {
    const { pathParameters } = event
    try {
        const user = await getUser(event)

        if (!user)
            return handlerResponse(400, {}, 'Usuário não encontrado')

        if (!user.havePermissionApprover)
            return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const { id } = pathParameters

        await dynamodb
            .delete({
                ...params,
                Key: {
                    productId: id,
                },
                ConditionExpression: "attribute_exists(productId)",
            })
            .promise();
        return handlerResponse(200, {}, `${RESOURCE_NAME} código (${id}) removido com sucesso`)
    } catch (err) {
        return handlerErrResponse(err, pathParameters)
    }
}