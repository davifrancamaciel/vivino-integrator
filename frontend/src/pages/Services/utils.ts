export const formatName = (name: string) => {
  if (name.includes('comission')) return { route: 'expenses/run-comission' };

  if (name.includes('viv-auth')) return { route: 'wines/run-auth' };

  if (name.includes('warning')) return { route: 'wines/run-wines-warning' };

  if (name.includes('viv-sales')) return { route: `wines/run-sales` };
  
  if (name.includes('backup')) return { route: 'services/run-backup' };

  if (name.includes('shipments')) return { route: 'wines/run-shipments' };

  return { name, route: '' };
};
