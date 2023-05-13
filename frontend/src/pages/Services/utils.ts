export const formatName = (name: string) => {
  if (name.includes('expenseComissionEvent'))
    return {
      name: 'Gera despesas de pagamento de comissão',
      route: 'expenses/run-comission'
    };

  if (name.includes('d3f0019aec1854488490b8078b91bb307'))
    return {
      name: 'Autentica loja na vivino e obtem token para requisições de api',
      route: 'wines/run-auth'
    };

  if (name.includes('winesWarningEvent'))
    return {
      name: 'Busca vinhos com estoque baixo',
      route: 'wines/run-wines-warning'
    };
  if (name.includes('d1f7ae31a1abb56f218dbf2615d7d5eed'))
    return {
      name: 'Busca vendas do dia anterior na vivino',
      route: 'wines/run-sales'
    };

  return { name, route: '' };
};
