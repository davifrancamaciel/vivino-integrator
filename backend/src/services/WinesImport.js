"use strict";

const { Op } = require('sequelize');
const db = require('../database');
const { executeUpdate } = require("../services/ExecuteQueryService");
const axios = require('axios');
const Wine = require('../models/Wine')(db.sequelize, db.Sequelize);
const seed = require('../database/seeds/wines.json')
const seed2 = require('../database/seeds/wines2.json')

const seeds = async () => {
    let array = []
    for (let i = 0; i < seed.length; i++) {
        const element = seed[i];
        const mame = element.title?.__cdata
        const wine2 = seed2.find(x => x.Nome === mame);

        const wine = {
            wine2,
            companyId: '6a9088cc-faec-481c-b5ed-18516cafc890',
            productName: mame,
            wineName: mame,
            price: element.sale_price?.__text,
            ean: element.gtin?.__cdata,
            link: element.link?.__cdata,
            image: element.image_link?.__cdata,
            active: element.availability.__text && element.availability.__text.toLowerCase() === 'in stock' ? true : false,
            quantityIsMinimum: true,
            bottleSize: '750 ml',


            bottleQuantity: 1,
            inventoryCount: 1,

            producer: wine2 && wine2['Vinícola'] ? wine2['Vinícola'] : null,
            vintage: wine2 && wine2['Safra'] ? wine2['Safra'] : null,
            // country: element.PAIS_CUSTOM,
            color: wine2 && wine2['Tipo do vinho'] ? wine2['Tipo do vinho'] : null,
            // description: element.CARACTERISTICAS,
            description: wine2 && wine2['Harmonização'] ? wine2['Harmonização'] : null,
            alcohol: wine2 && wine2['Teor alcoólico'] ? wine2['Teor alcoólico'] : null,
            producerAddress: wine2 && wine2['Região'] ? wine2['Região'] : null,
            ageing: wine2 && wine2['Tempo de Guarda'] ? wine2['Tempo de Guarda'] : null, //ENVELHECIMENTO
            appellation: null,
            importerAddress: null,
            varietal: wine2 && wine2['Uva'] ? wine2['Uva'] : null,
            closure: null,
            winemaker: null,
            productionSize: null,
            residualSugar: null,
            acidity: null,
            ph: null,
            containsMilkAllergens: false,
            containsEggAllergens: false,
            nonAlcoholic: false,
        };
        array.push(wine)

        const item = await Wine.findOne({ where: { productName: mame, companyId: wine.companyId } })
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

//#region processamento de vendas antigas com sku vivino
const arrayskus = [
    { sku: "VD-173266983", id: 10054 },
    { sku: "VD-174777880", id: 965 },
    { sku: "VD-169937700", id: 1621 },
    { sku: "VD-172695864", id: 10067 },
    { sku: "VD-171424406", id: 10069 },
    { sku: "VD-174777903", id: 1257 },
    { sku: "VD-168922651", id: 853 },
    { sku: "VD-169815663", id: 10068 },
    { sku: "VD-172635828", id: 1749 },
    { sku: "VD-170293076", id: 2110 },
    { sku: "VD-167819007", id: 957 },
    { sku: "VD-163290517", id: 1237 },
    { sku: "VD-162984306", id: 241 },
    { sku: "VD-166303609", id: 1753 },
    { sku: "VD-168635862", id: 1557 },
    { sku: "VD-165845189", id: 1273 },
    { sku: "VD-161025900", id: 1677 },
    { sku: "VD-164172029", id: 31 },
    { sku: "VD-170126070", id: 1777 },
    { sku: "VD-173074288", id: 2107 },
    { sku: "VD-142275746", id: 327 },
    { sku: "VD-169651950", id: 1625 },
    { sku: "VD-170126053", id: 1935 },
    { sku: "VD-168997679", id: 843 },
    { sku: "VD-166581839", id: 573 },
    { sku: "VD-170816215", id: 2103 },
    { sku: "VD-159726488", id: 7 },
    { sku: "VD-156341136", id: 1263 },
    { sku: "VD-164163495", id: 567 },
    { sku: "VD-172887376", id: 1946 },
    { sku: "VD-169882120", id: 1295 },
    { sku: "VD-170244898", id: 1741 },
    { sku: "VD-169879699", id: 1629 },
    { sku: "VD-172772271", id: 1948 },
    { sku: "VD-172613467", id: 1707 },
    { sku: "VD-171927307", id: 10066 },
    { sku: "VD-171684313", id: 79 },
    { sku: "VD-156135924", id: 1569 },
    { sku: "VD-167857723", id: 169 },
    { sku: "VD-164206547", id: 2100 },
    { sku: "VD-159459321", id: 1199 },
    { sku: "VD-169192805", id: 1931 },
    { sku: "AD-158923974", id: 409 },
    { sku: "AD-157871018", id: 403 },
    { sku: "AD-2730644", id: 805 },
    { sku: "AD-2769950", id: 2057 },
    { sku: "AD-1568747", id: 2056 },
    { sku: "AD-3682737", id: 239 },
    { sku: "AD-3476934", id: 799 },
    { sku: "AD-164942577", id: 2081 },
    { sku: "AD-157149419", id: 2063 },
    { sku: "AD-1480778", id: 2051 },
    { sku: "AD-1563658", id: 407 },
    { sku: "AD-153303193", id: 2083 },
    { sku: "AD-152327639", id: 2082 },
    { sku: "AD-4072643", id: 2064 },
    { sku: "AD-1930578", id: 2089 },
    { sku: "AD-1659821", id: 1589 },
    { sku: "AD-5725941", id: 1585 },
    { sku: "AD-164942645", id: 411 },
    { sku: "AD-164942636", id: 397 },
    { sku: "AD-164942648", id: 421 },
    { sku: "VD-159421168", id: 1951 },
    { sku: "VD-172887382", id: 1949 },
    { sku: "VD-156103106", id: 1953 },
    { sku: "VD-159328631", id: 1229 },
    { sku: "VD-159439897", id: 1393 },
    { sku: "VD-156284322", id: 521 },
    { sku: "VD-167450665", id: 1817 },
    { sku: "VD-171628988", id: 10001 },
    { sku: "VD-172225527", id: 1916 },

    { sku: "VD-169395951", id: 10045 },
    { sku: "VD-169525337", id: 10045 },

    { sku: "VD-172887378", id: 1950 },
    { sku: "VD-173508339", id: 1950 },

    { sku: "VD-159954172", id: 1405 },
    { sku: "VD-163010188", id: 1405 },

    { sku: "VD-159559869", id: 10031 },
    { sku: "VD-163118318", id: 10031 },

    { sku: "VD-30983803", id: 1413 },
    { sku: "VD-160083866", id: 1413 },

    { sku: "VD-168166007", id: 2004 },
    { sku: "VD-167821060", id: 1793 },
    { sku: "VD-167448996", id: 1533 },//20 e 22 01/2024
];

// await updateSkus('services_db_dev')
// await updateSkus('services_db')
const updateSkus = async (schema) => {
    for (let i = 0; i < arrayskus.length; i++) {
        const element = arrayskus[i];
        const query = `UPDATE ${schema}.wines SET skuVivino = '${element.sku}' WHERE id = ${element.id}`;
        await executeUpdate(query);
    }
}

// const list = await createHistory('VD-');
// return handlerResponse(200, list, 'Vendas obtidas com sucesso')
const createHistory = async (skuContains) => {
    try {
        const { count, rows } = await WineSale.findAndCountAll({
            where: {
                sale: { [Op.like]: `% ${skuContains}% ` }
            },
            limit: 1000,
            order: [['id', 'ASC']],
        })

        let list = [];

        for (let i = 0; i < rows.length; i++) {
            const element = rows[i];
            const { saleFormatted, createdAt, updatedAt, companyId, saleDate } = element
            const { items, user, created_at, id } = saleFormatted
            for (let j = 0; j < items.length; j++) {
                const item = items[j];
                if (item.sku.includes(skuContains)) {
                    const wineSku = arrayskus.find(x => x.sku === item.sku)
                    if (!wineSku) {
                        const message = `${item.sku} NÃO ENCONTRADO`
                        console.error(message)
                        throw new Error(message);
                    }
                    const itemHistory = {
                        wineId: wineSku.id,
                        companyId,
                        dateReference: saleDate,
                        total: item.unit_count,
                        inventoryCountBefore: 0,
                        createdAt,
                        updatedAt,
                        sale: { wineId: wineSku.id, wineSku: item.sku, id, created_at, unit_count: item.unit_count, user },
                        dateReferenceGroup: new Date(saleDate).toISOString().split('T')[0],
                    }
                    list.push(itemHistory)
                }
            }
        }

        const itemsProductsGroupBySku = groupBy(list, 'dateReferenceGroup')
        var historyArr = []
        for (let i = 0; i < itemsProductsGroupBySku.length; i++) {
            const arrayGrouped = itemsProductsGroupBySku[i];
            const saleGroupBySku = groupBy(arrayGrouped, 'wineId')
            const productsSales = saleGroupBySku.map(list => {
                const [product] = list
                const sales = list.map(x => x.sale)
                return { ...product, total: sum(list, 'total'), sales: JSON.stringify(sales) }
            });
            productsSales.map(x => historyArr.push(x))
        }
        // await WineSaleHistory.bulkCreate(historyArr);

        return { count, historyArr };
    } catch (error) {
        return error
    }
}

const remove = async () => {
    const arr = [10039, 10038, 10023, 2104, 2091, 2087, 2083, 2073, 2069, 2068, 2066, 2059, 2058, 2047, 2041, 2039, 2038, 2036, 2034, 2032, 2027, 2026, 2025, 2024, 2018, 2017, 2016, 2011, 2005, 2001, 1997, 1996, 1992, 1989, 1988, 1983, 1980, 1979, 1978, 1974, 1973, 1969, 1966, 1964, 1963, 1962, 1957, 1954, 1953, 1951, 1934, 1921, 1916, 1911, 1887, 1885, 1879, 1877, 1875, 1873, 1861, 1857, 1829, 1827, 1825, 1739, 1735, 1733, 1731, 1725, 1721, 1709, 1705, 1685, 1643, 1635, 1571, 1515, 1509, 1507, 1501, 1495, 1489, 1469, 1465, 1463, 1449, 1447, 1445, 1441, 1437, 1435, 1433, 1429, 1401, 1399, 1371, 1367, 1361, 1357, 1355, 1349, 1347, 1343, 1341, 1339, 1335, 1333, 1331, 1327, 1319, 1315, 1309, 1307, 1249, 1231, 1223, 1195, 1191, 1189, 1167, 1163, 1153, 1151, 1149, 1145, 1129, 1119, 1109, 1091, 1089, 1087, 1077, 1075, 1063, 1029, 1027, 1023, 1021, 1015, 1007, 1003, 981, 979, 971, 969, 961, 947, 945, 943, 941, 937, 929, 925, 923, 921, 915, 913, 907, 901, 899, 895, 891, 875, 871, 869, 863, 841, 835, 833, 831, 827, 817, 815, 813, 811, 809, 807, 803, 797, 795, 793, 791, 789, 787, 785, 783, 779, 775, 773, 767, 765, 761, 759, 757, 753, 749, 747, 745, 743, 741, 737, 735, 729, 727, 721, 717, 715, 713, 711, 701, 693, 687, 639, 637, 635, 631, 629, 627, 623, 615, 611, 581, 577, 563, 547, 541, 537, 535, 533, 529, 527, 525, 515, 513, 511, 509, 507, 503, 501, 499, 497, 495, 493, 491, 481, 477, 467, 465, 461, 459, 455, 451, 447, 445, 443, 441, 439, 437, 431, 425, 419, 417, 405, 401, 391, 387, 385, 379, 373, 369, 367, 365, 363, 361, 359, 353, 351, 345, 339, 337, 335, 333, 331, 325, 319, 317, 309, 307, 299, 293, 291, 289, 287, 285, 283, 281, 277, 271, 267, 265, 261, 257, 245, 233, 211, 207, 205, 203, 193, 191, 187, 183, 177, 167, 163, 159, 157, 155, 151, 147, 145, 139, 137, 133, 123, 121, 117, 113, 109, 103, 99, 95, 81, 75, 69, 67, 63, 57, 55, 53, 45, 43, 39, 33, 25, 17, 15, 13, 5, 1]
    for (let i = 0; i < arr.length; i++) {
        try {

            const element = arr[i];
            const wine = winesDel.find(x => x.id === element)
            const buket = 'services-integrator-api-prd-public'
            if (wine) {
                const key = wine?.image ? wine.image.replace(`https://${buket}.s3.amazonaws.com/`, '') : null
                if (key) {
                    const ret = await s3.remove(key, buket);
                }
            }
            else {
                console.log('não')
            }
        } catch (error) {
            console.log(error)
        }
    }
    return arr
}

//#endregion

const importImages = async () => {
    const resp = await Wine.findAll({
        attibutes: ['id', 'companyId', 'image'],
        order: [['id', 'DESC']],
        where: { companyId: '6a9088cc-faec-481c-b5ed-18516cafc890' }
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
                const query = `UPDATE wines AS p SET p.image = '${result.Location}' WHERE p.id = ${item.id}`;
                await executeUpdate(query);

                console.log(item.id, i, arr.length)
            }
        } catch (error) {
            console.error(wineId)
        }
    }
    return arr
}

module.exports = { seeds, importImages }