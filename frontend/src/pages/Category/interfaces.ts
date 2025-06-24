import { Company } from '../Company/interfaces';
export interface Category {
  id?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
  active: boolean;
  company?: Company;
}

export const initialStateForm: Category = {
  id: undefined,
  name: '',
  createdAt: '',
  updatedAt: '',
  active: true
};

export interface Filter {
  id?: string;
  name?: string;
  companiName?: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  id: '',
  name: '',
  pageNumber: 1,
  pageSize: 20
};
