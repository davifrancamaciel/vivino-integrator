'use strict';

const { QueryTypes } = require('sequelize');
const db = require('../database');

const executeSelect = async (query) => {
    return await db.sequelize.query(query, { type: QueryTypes.SELECT });
}
const executeInsert = async (query) => {
    return await db.sequelize.query(query, { type: QueryTypes.INSERT });
}
const executeUpdate = async (query) => {
    return await db.sequelize.query(query, { type: QueryTypes.UPDATE });
}
const executeDelete = async (query) => {
    return await db.sequelize.query(query, { type: QueryTypes.DELETE });
}

module.exports = { executeSelect, executeInsert, executeUpdate, executeDelete }