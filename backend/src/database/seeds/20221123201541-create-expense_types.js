'use strict';

const TABLE_NAME = 'expenseTypes';

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
  '13º 1ª parcela',
  '13º 2ª parcela',
  '13º integral',
  '13º parcial',
  'Pagamento salario semanal',
  'Pagamento salario mensal',
  'Férias',
  'Aluguel',
  'Contador',
  'Nota fiscal de produtos',
  'Agua',
  'Energia elétrica',
  'Gás',
  'Alimento',
  'Serviços de terceiros',
  'Manutenções',
  'Outros',
];

