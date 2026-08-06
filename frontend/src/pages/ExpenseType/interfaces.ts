export interface ExpenseType {
  id?: string;
  name?: string;
  description?: string;
  replicateNextMonth?: boolean;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;
}

export const initialStateForm: ExpenseType = {
  id: undefined,
  name: '',
  description: '',
  replicateNextMonth: false,
  createdAt: '',
  updatedAt: ''
};

export interface Filter {
  id?: string;
  name?: string;
  description?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  id: '',
  name: '',
  description: '',
  createdAtStart: '',
  createdAtEnd: '',
  pageNumber: 1,
  pageSize: 100
};
