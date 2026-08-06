import { IOptions } from 'utils/commonInterfaces';
import { appRoutes } from 'utils/defaultValues';
import { ExpenseResult } from './interfaces';

export const getType = () => {
  return appRoutes.expenses;
};

export const getTitle = (path: string, isPlural: boolean = false) => {
  switch (path) {
    default:
      return `Pagamento${isPlural ? 's' : ''}`;
  }
};

const array: Array<string> = ['BOLETO', 'CREDITO', 'DEBITO', 'DINHEIRO', 'PIX'];

export const paymentMethods: IOptions[] = array.map((x: string) => ({
  value: `${x}`,
  label: `${x}`
}));

export const getValueExpensesByTypes = (
  list: ExpenseResult[],
  filter: Array<number>,
  include: boolean
) => {
  try {
    let result = list.filter((x: ExpenseResult) => filter.includes(x.id));
    if (!include) {
      result = list.filter((x: ExpenseResult) => !filter.includes(x.id));
    }

    const summary = result.reduce(
      (acc, r) => {
        acc.totalValueMonth += Number(r.totalValueMonth);
        acc.count += r.count;
        return acc;
      },
      { totalValueMonth: 0, count: 0 }
    );

    return summary;
  } catch (error) {
    return { totalValueMonth: 0, count: 0 };
  }
};
