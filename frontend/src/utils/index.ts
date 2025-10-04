import { IOptions } from './commonInterfaces';

export const order = (data: any[], key: string) => {
  return data.sort(function (a, b) {
    if (a[key] > b[key]) {
      return 1;
    }
    if (a[key] < b[key]) {
      return -1;
    }
    return 0;
  });
};

export const limitString = (value: string, limit: number) =>
  value.length > limit ? value.slice(0, limit).concat('...') : value;

export const filterByValue = (array: IOptions[], value?: string) => {
  const item = array.find((i: IOptions) => i.value === value);
  return item ? item.label : '';
};

export const calculateSeconds = (date_inital: any) => {
  const date_finish: any = new Date();
  var difference = (date_finish - date_inital) / 1000;
  console.log(`Duração: ${difference} segundos`);
  return difference;
};

export const numberWithDots = (value: number) => {
  let text = value.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(text)) text = text.replace(pattern, '$1.$2');
  return text;
};

export const groupBy = (arr: any, prop: string) => {
  const map = new Map(Array.from(arr, (obj: any) => [obj[prop], [] as any]));
  arr.forEach((obj: any) => map.get(obj[prop]).push(obj));
  return Array.from(map.values());
};

export const createQueryString = (queryObject: any) => {
  let queryString = Object.keys(queryObject)
    .filter(
      (key) =>
        queryObject[key] &&
        !(Array.isArray(queryObject[key]) && !queryObject[key].length)
    )
    .map((key) => {
      return Array.isArray(queryObject[key])
        ? queryObject[key]
            .map(
              (item: any) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(item)}`
            )
            .join('&')
        : `${encodeURIComponent(key)}=${encodeURIComponent(queryObject[key])}`;
    })
    .join('&');
  return queryString ? `?${queryString}` : '';
};
