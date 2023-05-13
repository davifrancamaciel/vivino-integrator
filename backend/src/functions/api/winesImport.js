"use strict";

const { Op } = require('sequelize');
const db = require('../../database');
const Wine = require('../../models/Wine')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../../utils/handleResponse");
const { getUser } = require("../../services/UserService");
const seed = require('../../../../seeds.json')
const { executeUpdate } = require("../../services/ExecuteQueryService");

const RESOURCE_NAME = 'Vinho'

module.exports.import = async (event) => {
    try {
      
        if (!process.env.IS_OFFLINE)
            return handlerResponse(200, {}, 'Ops isso só pode rodar local hahahahha')

        // const result = await seeds();
        const result = await updateAll();


        return handlerResponse(201, result, `${RESOURCE_NAME} criado com sucesso`)
    } catch (err) {
        return handlerErrResponse(err)
    }
}

const formatDateCreatePtToEn = (value) => {
    const [date, hour] = value.split(' ')
    const [day, month, year] = date.split('/')
    return `${year}-${month}-${day} ${hour}`
}

const seeds = async () => {
    let array = []
    for (let i = 0; i < seed.length; i++) {
        const element = seed[i];

        const wine = {
            id: Number(element.ID),
            productName: element.PRODUTO,
            price: element.PRECO,
            quantityIsMinimum: element.QUANTIDADE_POR_CAIXA > 1,
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
            active: element.DISPONIVEL && element.DISPONIVEL.toLowerCase() === 'sim' ? true : false
        };
        array.push(wine)

        // const item = await Wine.findByPk(wine.id);
        // if (item) {
        //     wine.price = item.price;
        //     await item.update(wine);
        // }
        // else
        //     await Wine.create(wine);

        if (element.DATA_CADASTRO) {
            const date = formatDateCreatePtToEn(element.DATA_CADASTRO);
            const query = ` UPDATE wines AS p SET p.createdAt = '${date}' WHERE p.id = '${wine.id}'`;
            await executeUpdate(query);
        }
        return array;
    }
}

const updateAll = async () => {
    const resp = await Wine.findAll({
        attibutes: ['id', 'alcohol'],
        order: [['id', 'DESC']],
        limit: 2000,
    })


    const arr = resp.filter(x => x.alcohol != null && !x.alcohol.includes('%'))

    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        const item = await Wine.findByPk(element.id);

        const wine = {
            ...item,
            alcohol: `${item.alcohol}%`
        }
        await item.update(wine);

    }
    return arr
}