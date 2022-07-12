import {
  format,
  parseISO,
  formatDistance,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds
} from 'date-fns';
import pt from 'date-fns/locale/pt';
import moment from 'moment';

export const formatDate = (value: string) =>
  !value ? '' : format(parseISO(value), 'dd/MM/yyyy', { locale: pt });

export const formatDateHour = (value?: string) =>
  !value ? '' : format(parseISO(value), 'dd/MM/yyyy HH:mm', { locale: pt });

export const formatDateHourByNumber = (value?: string) =>
  !value ? '' : format(Number(value), 'dd/MM/yyyy HH:mm', { locale: pt });

export const extractHour = (value: string) =>
  !value ? '' : format(parseISO(value), 'HH:mm', { locale: pt });

export const setHour = (date: any, time: any) => {
  try {
    if (!date) return null;

    if (time && typeof time !== 'string') {
      time = time._d.toISOString();
      time = format(parseISO(time), 'HH:mm');
    }

    if (typeof date !== 'string') date = date._d.toISOString();

    if (!time) time = format(parseISO(date), 'HH:mm');

    const [hour, minute] = time.split(':');
    const newDate = setMilliseconds(
      setSeconds(setMinutes(setHours(parseISO(date), hour), minute), 0),
      0
    );
    return newDate;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const duration = (s: number) =>
  formatDistance(0, s * 1000, {
    includeSeconds: true,
    locale: pt
  });
