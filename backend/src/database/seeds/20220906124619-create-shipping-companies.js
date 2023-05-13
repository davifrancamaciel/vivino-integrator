'use strict';

const { companyIdDefault } = require("../../utils/defaultValues");

const TABLE_NAME = 'shippingCompanies';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, load(), {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  },
};

function load() {
  const list = [];
  for (let i = 0; i < data_array.length; i++) {
    list.push({
      name: data_array[i],
      companyId: companyIdDefault,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return list;
}

const data_array = [
  'Transalfa ',
  'TNT Fedex',
  'Camilo dos Santos',
  'Correios',
  'Motorista Igor',
  'Motorista Daniel',
  'Motorista Patrick',
  'Motorista Andre',
  'Outros',
];

