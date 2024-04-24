"use strict";

const { Op } = require('sequelize');
const db = require('../../database');
const Wine = require('../../models/Wine')(db.sequelize, db.Sequelize);
const { create } = require('xmlbuilder2');
const s3 = require("../../services/AwsS3Service");
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { companyIdDefault } = require('../../utils/defaultValues');
const { readMessageRecursive } = require("./_baseQueue");

module.exports.handler = async (event) => {

    try {
        const { pathParameters } = event
        let result = null;
        
        if (event.Records)
            result = await readMessageRecursive(event.Records, 0, createFileXml);
        else if (!event.Records && pathParameters)
            result = await createFileXml({ companyId: pathParameters.companyId });
        else
            messageInfo = 'Não existem mensagens pendentes de processamento na fila.'

        return handlerResponse(201, { result })
    }
    catch (err) {
        return await handlerErrResponse(err)
    }
}

const createFileXml = async ({ companyId }) => {
    const fileName = 'vivinofeed.xml';
    const key = `${companyId}/${fileName}`;

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

    const { bucketPublicName, STAGE } = process.env
    await s3.remove(key, bucketPublicName);
    const result = await s3.put(xml, key, bucketPublicName);

    if (companyId == companyIdDefault && STAGE === 'prd') {
        const bucket = 'vivino-integrator-api-prod-feeds';
        await s3.remove(fileName, bucket);
        await s3.put(xml, fileName, bucket);        
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