"use strict";

const { Op } = require('sequelize');
const db = require('../database');
const { startOfMonth, endOfMonth } = require('date-fns');
const Product = require('../models/Product')(db.sequelize, db.Sequelize);
const { handlerResponse, handlerErrResponse } = require("../utils/handleResponse");
const { getUser, checkRouleProfileAccess } = require("../services/UserService");
const { roules, particularUsers } = require("../utils/defaultValues");

const { executeSelect } = require("../services/ExecuteQueryService");

module.exports.handler = async (event, context) => {
    try {
        
        const QUEUE_URL = `${process.env.SQS_URL}-expenses`
        return handlerResponse(200, { event })
    } catch (err) {
        return handlerErrResponse(err)
    }
};
