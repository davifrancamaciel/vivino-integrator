export const formatName = (name: string) => {
  if (name.includes('expenseComissionEvent'))
    return {
      name: 'Gera despesas de pagamento de comissão',
      route: 'expenses/run-comission'
    };

  if (name.includes('winesVivIntApiAuthEvent'))
    return {
      name: 'Autentica loja na vivino e obtem token para requisições de api',
      route: 'wines/run-auth'
    };

  if (name.includes('winesWarningEvent'))
    return {
      name: 'Busca vinhos com estoque baixo',
      route: 'wines/run-wines-warning'
    };
  if (name.includes('winesVivIntApiSalesEvent'))
    return {
      name: 'Busca vendas do dia anterior na vivino',
      route: `wines/run-sales?dateReference=${
        new Date().toISOString().split('T')[0]
      }`
    };
  if (name.includes('backupEvent'))
    return {
      name: 'Backup do banco de dados',
      route: 'services/run-backup'
    };

  return { name, route: '' };
};
