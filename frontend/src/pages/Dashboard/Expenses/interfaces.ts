import { Expense } from '@/pages/Expense/interfaces';

export interface ExpenseDto {
  ids: string;
  titles: string;
  amount: number;
  value: number;
  paidOut: boolean;
  paymentDate: string;
  expenses: Expense[];
}
