import { types } from './interfaces';

export const formatName = (name: string) => {
  if (name.includes('GenerateFiles')) {
    return 'Servico gerador de Feed XML Vivino';
  }
   
  return '';
};

export const formatSchedule = (schedule: string) => {
  const time = schedule.replace('rate(', '').replace(')', '');
  let [value, type] = time.split(' ');
  let typeFormatted = '';
  switch (type) {
    case 'minute':
    case 'minutes':
      typeFormatted = 'minuto';
      type = types.MINUTE;
      break;
    case 'hour':
    case 'hours':
      typeFormatted = 'hora';
      type = types.HOUR;
      break;
    case 'day':
    case 'days':
      typeFormatted = 'dia';
      type = types.DAY;
      break;

    default:
      break;
  }
  return {
    value,
    type,
    scheduleExpressionFormatted: `A cada ${value} ${typeFormatted}${
      Number(value) > 1 ? 's' : ''
    }`
  };
};
