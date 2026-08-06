import { Company } from '../Company/interfaces';
export interface ExpenseType {
  name: string;
  description?: string;
  replicateNextMonth: boolean;
}
export interface Expense {
  id?: string;
  expenseType?: ExpenseType;
  company?: Company;
  expenseTypeId?: number;
  userId?: number;
  // vehicleId?: number;
  // supplierId?: number;
  dividedIn: number;
  value?: number;
  valueFormatted?: string;
  amount?: number;
  title?: string;
  paymentMethod?: string;
  description?: string;
  paidOut: boolean;
  paymentDate?: string;
  replicateNextMonth: boolean;
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
  paidOut: false,
  replicateNextMonth: false
};

export interface Filter {
  id?: string;  
  expenseTypeId?: any;
  userName?: string;
  vehicleModel?: string;
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
  title: '',
  description: '',
  pageNumber: 1,
  pageSize: 100
};

export interface ExpenseResult {
  count: number;
  totalValueMonth: number;
  paidOut: boolean;
  id: number;
  name: string;
}
export interface CardsResult {
  pay: ExpenseResult[];
  type: ExpenseResult[];
}

export const initialStateCards: CardsResult = {
  pay: [],
  type: []
};

export interface DataType {
  paymentDate: string;
  expenseTypeName: string;
}
