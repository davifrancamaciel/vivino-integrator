"use strict";

const db = require('../database');
const Product = require('../models/Product')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../utils/handleResponse");
const { getUser } = require("../services/UserService");
const seed = require('../../seeds.json')

const RESOURCE_NAME = 'Vinho'

module.exports.import = async (event) => {
    try {
        // const user = await getUser(event)

        // if (!user)
        //     return handlerResponse(400, {}, 'Usuário não encontrado')

        // if (!user.havePermissionApprover)
        //     return handlerResponse(403, {}, 'Usuário não tem permissão acessar esta funcionalidade')


        let array = []
        for (let i = 0; i < seed.length; i++) {
            const element = seed[i];

            const product = {
                id: Number(element.ID),
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
            };
            array.push(product)

            const item = await Product.findByPk(product.id);
            if (item) await item.update(product);
            else await Product.create(product);
        }

        return handlerResponse(201, array, `${RESOURCE_NAME} criado com sucesso`)
    } catch (err) {
        return handlerErrResponse(err)
    }
}

