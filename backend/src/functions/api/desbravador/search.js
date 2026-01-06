
"use strict";

const axios = require('axios');
const { startOfDay, endOfDay, subDays } = require('date-fns');
const db = require('../../../database');
const Company = require('../../../models/Company')(db.sequelize, db.Sequelize);
const { executeUpdate, executeSelect } = require("../../../services/ExecuteQueryService");
const { handlerResponse, handlerErrResponse } = require("../../../utils/handleResponse");
const { formatDate } = require("../../../utils/formatDate");
const formatPrice = require("../../../utils/formatPrice");
const { sum } = require("../../../utils");

module.exports.handler = async (event, context) => {

    let companyId = '';

    try {
        context.callbackWaitsForEmptyEventLoop = false;

        const { companyId, start, end } = event.queryStringParameters

        let startFormated = normalizeDate(start)
        let endFormated = normalizeDate(end)

        const body = {
            wsrolRQ: {
                "hotelLoginRQ": {
                    "slug": "hotel-granja-brasil-resort",
                    "origem": "rolweb",
                    "ip": "201.19.154.187"
                }
            }
        }

        const bodyRates = body
        bodyRates.wsrolRQ.tarifasRQ = {
            "tarifas": {
                // "datainicio": formatDate(startFormated),
                // "datafim": formatDate(endFormated),
                "datainicio": start,
                "datafim": end,
                "detalhes": true,
                "cdpessoa": 0,
                "cdpessoalog": 0,
                "cdvoucher": 0,
                "fgaplicacao": "0"
            }
        }
        const ratesData = await get(bodyRates);
        const rates = ratesData.wsrolRS.tarifasRS.tarifas.valores       

        const bodyAccommodations = body
        bodyAccommodations.wsrolRQ.hotelInfoRQ = {
            "parametros": false,
            "profissoes": false,
            "hotelInfo": false,
            "politicas": false,
            "quartos": true
        }
        const accommodationsData = await get(bodyAccommodations);
        const accommodations = accommodationsData.wsrolRS.hotelInfoRS.quartos
        
        const data = [];

        data.push(createObj(rates["MAS"], accommodations["MAS"]))
        data.push(createObj(rates["SUP"], accommodations["SUP"]))
        data.push(createObj(rates["SEN"], accommodations["SEN"]))
       
        const dataFormatted = data.map(element => {
            const tarifas = Object.entries(element.PAD01).map((key) => {
                const obj = {
                    date: key[0],
                    value: Number(key[1].perocc["1"]),
                    valueFormated: formatPrice(key[1].perocc["1"])
                }
                return obj
            });
            const quantidade = tarifas.length > 1 ? tarifas.length - 1 : 1
            const lastDay = tarifas[tarifas.length - 1].value
            const valorMedio = tarifas.length > 1 ? (sum(tarifas, 'value') - lastDay) / quantidade : lastDay
            return {
                ...element,
                quantidade,
                tarifas,
                valorMedio: formatPrice(valorMedio),
                total: formatPrice(valorMedio * quantidade),
                descricao: element.descricao.portugues,
                obs: element.obs.portugues,
                media: element.media.imagens.map(x => `${element.media.localimagens}${x}`),
                facilidades: null,
                PAD01: null,
            }
        });
        
        const message = dataFormatted.map(x => (` ${x.descricao} diária média de ${x.valorMedio} total de ${x.total} para ${x.quantidade} dias \n`)).join()

        return handlerResponse(200, { message, dataFormatted });
    } catch (err) {
        const message = `ERRO AO BUSCAR ACOMODAÇÕES`
        return await handlerErrResponse(err, null, message)
    }
};

const get = async (body) => {
    const config = {
        method: 'POST',
        maxBodyLength: Infinity,
        url: `https://reservas.desbravador.com.br/reservas/modules/ws/interface.php`,
        headers: { 'Authorization': `Basic cm9sRHNsOkJyNDVpMUAyMDE4` },
        data: body
    };

    const { data } = await axios(config);
    return data;
}


const normalizeDate = (date) => {
    const currentDate = new Date();

    return currentDate;
}

const createObj = (rate, accommodation) => {

    const obj = {
        ...rate,
        ...accommodation
    }
    return obj;
}

