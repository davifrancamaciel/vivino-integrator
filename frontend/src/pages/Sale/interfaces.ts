import { Company } from './../Company/interfaces';
export interface User {
  name: string;
}
export interface Product {
  id?: number;
  name: string;
  size: string;
  price: number;
}
export interface SaleProduct {
  id?: string;
  productId: number;
  value: number;
  valueStr?: string;
  valueAmount: number;
  amount: number;
  amountStr?: string;
  product: Product;
}
export interface Sale {
  company?: Company;
  id?: string;
  user?: User;
  client?: User;
  products: Product[];
  productsSales: SaleProduct[];
  value?: number;
  note?: string;
  userId?: string;
  clientId?: string;
  userName?: string;
  clientName?: string;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;
}

export const initialStateForm: Sale = {
  id: undefined,
  products: [],
  productsSales: []
};

export interface Filter {
  id?: string;
  product?: string;
  note?: string;
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
