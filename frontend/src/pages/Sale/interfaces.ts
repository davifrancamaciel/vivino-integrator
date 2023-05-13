import { Product } from './CreateEdit/Products/interfaces';
export interface User {
  name: string;
}
export interface Sale {
  id?: string;
  user?: User;
  products: Product[];
  value?: number;
  note?: string;
  userId?: string;
  userName?: string;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;
}

export const initialStateForm: Sale = {
  id: undefined,
  products: []
};

export interface Filter {
  id?: string;
  product?: string;
  valueMin?: string;
  valueMax?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  id: '',
  product: '',
  pageNumber: 1,
  pageSize: 10
};
