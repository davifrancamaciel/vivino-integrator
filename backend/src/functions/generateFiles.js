"use strict";

const { Op } = require('sequelize');
const db = require('../database');
const Product = require('../models/Product')(db.sequelize, db.Sequelize);
const { create } = require('xmlbuilder2');
const s3 = require("../services/AwsS3Service");
const { handlerResponse, handlerErrResponse } = require("../utils/handleResponse");


module.exports.handler = async (event) => {
    const { bucketName } = process.env
    const key = 'vivinofeed.xml'
    try {

        if (process.env.IS_OFFLINE)
            return handlerResponse(200, {}, 'Processo rodando local')

        const resp = await Product.findAll({
            where: {
                active: true,
                inventoryCount: { [Op.gte]: 1 },
                bottleQuantity: { [Op.gte]: 1 }
            },
            order: [['id', 'DESC']],
            limit: 2000,
        })

        const root = create({ version: '1.0', encoding: "UTF-8" }).ele('vivino-product-list')

        let products = []
        resp.forEach(element => {

            const p = {
                id: element.id,
                wineName: element.wineName,
                productName: element.productName,
                customName: formatName(element),
                alcohol: element.alcohol,
                alcoholFormatedd: formatAlcohol(element.alcohol)
            }
            products.push(p)

            var product = root.ele('product')

            product.ele('product-name').txt(element.productName).up()
            product.ele('price').txt(element.price).up()
            product.ele('quantity-is-minimum').txt(element.quantityIsMinimum ? true : false).up()
            product.ele('bottle_size').txt(element.bottleSize).up()
            product.ele('bottle_quantity').txt(element.bottleQuantity).up()
            product.ele('link').txt(element.link).up()
            product.ele('inventory-count').txt(element.inventoryCount).up()
            product.ele('product-id').txt(element.id).up()

            var extras = product.ele('extras')
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

            product.up()
        });

        root.up();

        const xml = root.end({ prettyPrint: true });
        console.log(xml);

        await s3.remove(key, bucketName);
        const result = await s3.put(xml, key, bucketName);
        console.log(result)
        return handlerResponse(201, { result, products })
    }
    catch (err) {
        return handlerErrResponse(err)
    }

}
const formatName = (product) => {
    let pName = ''
    if (product.producer)
        pName = `${pName} ${product.producer}`
    if (product.productName)
        pName = `${pName} ${product.productName}`
    if (product.appellation)
        pName = `${pName} ${product.appellation}`
    if (product.vintage)
        pName = `${pName} ${product.vintage}`
    if (product.color)
        pName = `${pName} ${product.color}`
    return pName.trim()
}

const formatAlcohol = (alcohol) => {

    if (alcohol && alcohol.includes(','))
        alcohol = alcohol.replace(',', '.')
    if (alcohol && !alcohol.includes('%'))
        alcohol = `${alcohol}%`

    return alcohol
}