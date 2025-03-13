const { format, parseISO } = require('date-fns');
const pt = require('date-fns/locale/pt');

const formatDate = (value) =>
!value ? '' : format(parseISO(value), 'dd/MM/yyyy', { locale: pt });

const formatDateHour = (value) =>
  !value ? '' : format(parseISO(value), 'dd/MM/yyyy HH:mm', { locale: pt });

const formatDateHourByNumber = (value) =>
  !value ? '' : format(Number(value), 'dd/MM/yyyy HH:mm', { locale: pt });

const extractHour = (value) =>
  !value ? '' : format(parseISO(value), 'HH:mm', { locale: pt });

const formatDateNameMonth = (value) =>
  !value ? '' : format(parseISO(value), "dd 'de' MMMM 'de' yyyy", { locale: pt });

module.exports = {
  formatDate,
  formatDateHour,
  formatDateHourByNumber,
  extractHour,
  formatDateNameMonth
}