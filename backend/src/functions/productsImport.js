"use strict";

const AWS = require("aws-sdk");
const { handlerResponse, handlerErrResponse } = require("../utils/handleResponse");
const { getUser } = require("../services/UserService");
const seed = require('../../seeds.json')

const RESOURCE_NAME = 'Vinho'

const dynamodb = new AWS.DynamoDB.DocumentClient();

const params = {
    TableName: process.env.PRODUCTS_TABLE,
};

module.exports.import = async (event) => {
    try {
        // const user = await getUser(event)

        // if (!user)
        //     return handlerResponse(400, {}, 'Usuário não encontrado')

        // if (!user.havePermissionApprover)
        //     return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')

        const timestamp = new Date().getTime();
        let array = []
        await seed.forEach(async element => {
            const product = {
                productId: element.ID,
                productName: element.PRODUTO,
                price: element.PRECO,
                quantityIsMinimum: false,
                bottleSize: null,
                bottleQuantity: element.QUANTIDADE_POR_CAIXA,
                link: element.URL_PRODUTO,
                inventoryCount: element.ESTOQUE_ATUAL,
                producer: element.PRODUTOR,
                wineName: element.PRODUTO,
                appellation: null,
                vintage: element.SAFRA,
                country: element.PAIS_CUSTOM,
                color: element.SAFRA,
                image: element.IMAGEM,
                ean: element.EAN_GTIN_UPC,
                description: element.CARACTERISTICAS,
                alcohol: element.GRAU_ALCOOLICO,
                producerAddress: element.REGIAO_PRODUTORA,
                importerAddress: null,
                varietal: null,
                ageing: element.ENVELHECIMENTO,
                closure: null,
                winemaker: null,
                productionSize: null,
                residualSugar: null,
                acidity: null,
                ph: null,
                containsMilkAllergens: false,
                containsEggAllergens: false,
                nonAlcoholic: false,
                active: element.DISPONIVEL && element.DISPONIVEL.toLowerCase() === 'sim' ? true : false,
                createdAt: timestamp,
                updatedAt: timestamp,
            };
            array.push(product)
            await dynamodb.put({ ...params, Item: product }).promise();
        });

        return handlerResponse(201, array, `${RESOURCE_NAME} criado com sucesso`)
    } catch (err) {
        return handlerErrResponse(err)
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
        const result = await dynamodb
            .update({
                ...params,
                Key: {
                    productId,
                },
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
                    ":productName": productName,
                    ":price": price,
                    ":quantityIsMinimum": quantityIsMinimum,
                    ":bottleSize": bottleSize,
                    ":bottleQuantity": bottleQuantity,
                    ":link": link,
                    ":inventoryCount": inventoryCount,
                    ":producer": producer,
                    ":wineName": wineName,
                    ":appellation": appellation,
                    ":vintage": vintage,
                    ":country": country,
                    ":color": color,
                    ":image": image,
                    ":ean": ean,
                    ":description": description,
                    ":alcohol": alcohol,
                    ":producerAddress": producerAddress,
                    ":importerAddress": importerAddress,
                    ":varietal": varietal,
                    ":ageing": ageing,
                    ":closure": closure,
                    ":winemaker": winemaker,
                    ":productionSize": productionSize,
                    ":residualSugar": residualSugar,
                    ":acidity": acidity,
                    ":ph": ph,
                    ":containsMilkAllergens": containsMilkAllergens,
                    ":containsEggAllergens": containsEggAllergens,
                    ":nonAlcoholic": nonAlcoholic,
                    ":active": active,
                    ":updatedAt": timestamp,
                },
            })
            .promise();
        return handlerResponse(204, result, `${RESOURCE_NAME} alterado com sucesso`)
    } catch (err) {
        return handlerErrResponse(err, body)
    }
}

