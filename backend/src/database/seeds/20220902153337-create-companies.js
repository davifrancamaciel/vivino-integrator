'use strict';

const TABLE_NAME = 'companies';

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
  for (let i = 1; i < data_array.length; i++) {
    list.push({
      name: data_array[i],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  return list;
}

const data_array = [
  'Wine Brothers',
  'Ventura Vinhos',
  'LF Market',
  'Rose Market',
  'Ventus Prime',
  'Ary Delicatessen',
  'Ely Delicatessen',
  'Ubimar',
];

