"use strict";

const { Op } = require('sequelize');
const db = require('../../database');
const Wine = require('../../models/Wine')(db.sequelize, db.Sequelize);
const { create } = require('xmlbuilder2');
const s3 = require("../../services/AwsS3Service");
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { companyIdDefault } = require('../../utils/defaultValues');

module.exports.handler = async (event) => {

    try {
        const { pathParameters } = event
        let result = null;

        if (process.env.IS_OFFLINE)
            return handlerResponse(200, {}, 'Processo rodando local')

        if (event.Records)
            result = await readMessageRecursive(event.Records, 0);
        else if (!event.Records && pathParameters)
            result = await createFileXml(pathParameters.companyId);
        else
            messageInfo = 'Não existem mensagens pendentes de processamento na fila.'

        return handlerResponse(201, { result })
    }
    catch (err) {
        return handlerErrResponse(err)
    }
}

const readMessageRecursive = async (messages, position) => {
    try {
        const message = messages[position];
        const body = JSON.parse(message.body);
        const { companyId } = body

        console.log(`PROCESSANDO MENSAGEM ${position + 1} de ${messages.length}`);
        console.log(`MENSAGEM`, body);

        const result = await createFileXml(companyId);

        position = position + 1
        if (messages.length > position)
            return await readMessageRecursive(messages, position);

        return result;
    } catch (error) {
        console.log('error ', error);
        throw new Error('Não foi possível executar este item da fila');
    }
}

const createFileXml = async (companyId) => {
    const key = `${companyId}/vivinofeed.xml`

    const resp = await Wine.findAll({
        where: {
            active: true,
            inventoryCount: { [Op.gte]: 1 },
            bottleQuantity: { [Op.gte]: 1 },
            companyId
        },
        order: [['id', 'DESC']],
    })

    const root = create({ version: '1.0', encoding: "UTF-8" }).ele('vivino-product-list')

    resp.forEach(element => {

        var wine = root.ele('product')

        wine.ele('product-name').txt(element.productName).up()
        wine.ele('price').txt(element.price).up()
        wine.ele('quantity-is-minimum').txt(element.quantityIsMinimum ? true : false).up()
        wine.ele('bottle_size').txt(element.bottleSize).up()
        wine.ele('bottle_quantity').txt(element.bottleQuantity).up()
        wine.ele('link').txt(element.link).up()
        wine.ele('inventory-count').txt(element.inventoryCount).up()
        wine.ele('product-id').txt(element.id).up()

        var extras = wine.ele('extras')
        extras.ele('producer').txt(element.producer).up()
        extras.ele('wine-name').txt(element.wineName).up()
        extras.ele('appellation').txt(element.appellation).up()
        extras.ele('vintage').txt(element.vintage).up()
        extras.ele('country').txt(element.country).up()
        extras.ele('color').txt(element.color).up()
        extras.ele('image').txt(element.image).up()
        extras.ele('ean').txt(element.ean).up()
        extras.ele('description').txt(element.description).up()
        extras.ele('alcohol').txt(formatAlcohol(element.alcohol)).up()
        extras.ele('producer-address').txt(element.producerAddress).up()
        extras.ele('importer-address').txt(element.importerAddress).up()
        extras.ele('varietal').txt(element.varietal).up()
        extras.ele('ageing').txt(element.ageing).up()
        extras.ele('closure').txt(element.closure).up()
        extras.ele('winemaker').txt(element.winemaker).up()
        extras.ele('production-size', { unit: 'bottles' }).txt(element.productionSize).up()
        extras.ele('residual-sugar', { unit: 'g/l' }).txt(element.residualSugar).up()
        extras.ele('acidity', { unit: 'g/l' }).txt(element.acidity).up()
        extras.ele('ph').txt(element.ph).up()
        extras.ele('contains-milk-allergens').txt(element.containsMilkAllergens ? 'yes' : 'no').up()
        extras.ele('contains-egg-allergens').txt(element.containsEggAllergens ? 'yes' : 'no').up()
        extras.ele('non-alcoholic').txt(element.nonAlcoholic ? 'yes' : 'no').up()
        extras.up()

        wine.up()
    });

    root.up();

    const xml = root.end({ prettyPrint: true });

    const { bucketName } = process.env
    await s3.remove(key, bucketName);
    const result = await s3.put(xml, key, bucketName);

    console.log(result)

    if (companyId == companyIdDefault) {
        await s3.remove('vivinofeed.xml', bucketName);
        const resultAry = await s3.put(xml, 'vivinofeed.xml', bucketName);
        console.log(resultAry)
    }

    return { result }
}

const formatAlcohol = (alcohol) => {

    if (alcohol && alcohol.includes(','))
        alcohol = alcohol.replace(',', '.')
    if (alcohol && !alcohol.includes('%'))
        alcohol = `${alcohol}%`

    return alcohol
}