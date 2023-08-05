"use strict";


const db = require('../../database');
const Wine = require('../../models/Wine')(db.sequelize, db.Sequelize);
const { executeUpdate } = require("../../services/ExecuteQueryService");
const axios = require('axios');
const s3 = require("../../services/AwsS3Service");

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

const importImages = async () => {
    const resp = await Wine.findAll({
        attibutes: ['id', 'companyId', 'image'],
        order: [['id', 'DESC']],
    })

    const arr = resp.filter(x => x.image != null)
    let wineId = 0

    for (let i = 0; i < arr.length; i++) {
        try {
            const item = arr[i];
            if (!item.image.includes('services-integrator-api-prd-public')) {

                wineId = item.id
                const config = {
                    method: 'GET',
                    maxBodyLength: Infinity,
                    url: item.image,
                    responseType: 'stream'
                };

                const { data } = await axios(config);
                const arrImageName = item.image.split('/')
                const key = `${item.companyId}/wines/${item.id}/${arrImageName[arrImageName.length - 1]}`

                const result = await s3.put(data, key, 'services-integrator-api-prd-public');
                const query = ` UPDATE wines AS p SET p.image = '${result.Location}' WHERE p.id = ${item.id}`;
                await executeUpdate(query);

                console.log(item.id, i, arr.length)
            }
        } catch (error) {
            console.error(wineId)
        }
    }
    return arr
}

module.exports = { importImages }