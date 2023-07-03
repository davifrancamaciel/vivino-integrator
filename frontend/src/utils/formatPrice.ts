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

export function formatValueWhithDecimalCaseOnChange(value: any) {
  if (!value) return '';
  let newVal = value.toString().replace(/\D/g, '');

  if (newVal.length >= 11) {
    newVal = newVal.substring(0, 11);
  }
  newVal = newVal.replace(/\D/g, ''); // permite digitar apenas numero

  newVal = newVal.replace(/(\d{1})(\d{11})$/, '$1.$2');
  newVal = newVal.replace(/(\d{1})(\d{8})$/, '$1.$2');
  newVal = newVal.replace(/(\d{1})(\d{5})$/, '$1.$2');
  newVal = newVal.replace(/(\d{1})(\d{1,2})$/, '$1,$2');

  return newVal;
}

export function formatNumberWhithDecimalCaseOnChange(value: any) {
  if (!value) return '';
  let newVal = value.toString().replace(/\D/g, '');

  if (newVal.length >= 11) {
    newVal = newVal.substring(0, 11);
  }
  newVal = newVal.replace(/\D/g, ''); // permite digitar apenas numero

  newVal = newVal.replace(/(\d{1})(\d{11})$/, '$1$2');
  newVal = newVal.replace(/(\d{1})(\d{8})$/, '$1$2');
  newVal = newVal.replace(/(\d{1})(\d{5})$/, '$1$2');
  newVal = newVal.replace(/(\d{1})(\d{1,2})$/, '$1.$2');

  return newVal;
}