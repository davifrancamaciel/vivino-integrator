export interface ExpenseType {
  name: string;
}
export interface Expense {
  id?: string;
  expenseType?: ExpenseType;
  expenseTypeId?: number;
  dividedIn: number;
  value?: number;
  title?: string;
  description?: string;
  paidOut: boolean;
  paymentDate?: string;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;
}

export const initialStateForm: Expense = {
  id: undefined,
  dividedIn: 1,
  createdAt: '',
  updatedAt: '',
  paymentDate: new Date().toISOString(),
  paidOut: false
};

export interface Filter {
  id?: string;
  expenseTypeName?: string;
  title?: string;
  description?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  paymentDateStart?: string;
  paymentDateEnd?: string;
  paidOut?: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  id: '',
  expenseTypeName: '',
  title: '',
  description: '',
  pageNumber: 1,
  pageSize: 20
};
