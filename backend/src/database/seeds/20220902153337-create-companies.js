'use strict';

const { companyIdDefault } = require("../../utils/defaultValues");

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

  const list = [
    {
      id: companyIdDefault,
      name: 'Ary Delicatessen',
      groups: JSON.stringify([
        'Usuarios',
        'Produtos',
        'Romaneios'
      ]),
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      id: '7e39bb26-a932-412a-995d-ca7edd356d9d',
      name: 'Loja das flores',
      groups: JSON.stringify([
        'Usuarios',
        'Vendas',
        'Vendedor_vendas',
        'Despesas',
      ]),
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  return list;
}