"use strict";

const xl = require('excel4node');
const s3 = require("../services/AwsS3Service");
const { formatDateHour } = require('../utils/formatDate')
const formatPrice = require("../utils/formatPrice");

const create = async (companyId, data) => {
    let id = [];
    let productName = [];
    let price = [];
    let inventoryCount = [];
    let updatedAt = [];
    let link = [];

    data.forEach(element => {
        id.push(element.id.toString());
        productName.push(element.productName);
        price.push(element.price);
        inventoryCount.push(element.inventoryCount.toString());
        updatedAt.push(formatDateHour(element.updatedAt.toISOString()));
        link.push(element.link);
    });
    var wb = new xl.Workbook()
    var ws = wb.addWorksheet('Vinhos')
    const cols = ['Código', 'Nome do produto', 'Preço', 'Estoque', 'Data de alteração', 'Link do vinho no seu site']
    var style = wb.createStyle({
        font: {
            size: 12
        }
    });
    cols.forEach((c, i) => { ws.cell(1, i + 1).string(c) })
    for (var j = 0; j < data.length; j++) {
        let t = 2;
        ws.cell(t + j, 1).string(id[j]).style(style);
        ws.cell(t + j, 2).string(productName[j]).style(style);
        ws.cell(t + j, 3).string(formatPrice(price[j])).style(style);
        ws.cell(t + j, 4).string(inventoryCount[j]).style(style);
        ws.cell(t + j, 5).string(updatedAt[j]).style(style);
        ws.cell(t + j, 6).string(link[j]).style(style);
    }
    const buffer = await wb.writeToBuffer()

    const { bucketName } = process.env

    const key = `${companyId}/winesWarning.xls`
    return await s3.put(buffer, key, bucketName);
}

module.exports = { create }