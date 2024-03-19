"use strict";

const db = require('../database');
const Wine = require('../models/Wine')(db.sequelize, db.Sequelize);
const seed = require('../database/seeds/wines.json')

const seeds = async () => {
    let array = []
    for (let i = 0; i < seed.length; i++) {
        const element = seed[i];

        var productName = element.nome.replace(' 750ML', '')
        const wine = {
            // id: Number(element.ID),
            productName,
            price: Number(element.preco.toString().replace(',', '.')),
            quantityIsMinimum: false,
            bottleSize: '750 ml',
            bottleQuantity: 1,
            // link: `${element.link}/${element.nome.replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-').toLowerCase()}`,
            inventoryCount: element.Estoque,
            producer: element.Marca,
            wineName: productName,
            appellation: null,
            vintage: null,
            country: null,
            color: null,
            // image: null,
            ean: null,
            description: element.DescricaoFornecedor,
            alcohol: null,
            producerAddress: null,
            importerAddress: null,
            varietal: null,
            ageing: null,
            closure: null,
            winemaker: null,
            productionSize: null,
            residualSugar: null,
            acidity: null,
            ph: null,
            containsMilkAllergens: false,
            containsEggAllergens: false,
            nonAlcoholic: false,
            active: true,
            companyId: 'f3dd3202-4ce6-4303-9a92-1c99e1b5a7e6'
        };
        array.push(wine)

        const item = await Wine.findOne({ where: { productName, companyId: wine.companyId } })
        if (item) 
            await item.update(wine);        
        else
            await Wine.create(wine);
    }

    return array;
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

        const product = {
            ...item,
            alcohol: `${item.alcohol}%`
        }
        await item.update(product);

    }
    return arr
}

module.exports = { seeds }