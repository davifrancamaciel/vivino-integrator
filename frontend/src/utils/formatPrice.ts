export const { format: formatPrice } = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

export const priceToNumber = (v: string) => {
  if (!v) {
    return 0;
  }
  v = v.toString();
  v = v.split('.').join('');
  v = v.split(',').join('.');
  return Number(v.replace(/[^0-9.]/g, ''));
};
