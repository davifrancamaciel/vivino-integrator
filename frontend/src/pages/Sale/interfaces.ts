export interface User {
  name: string;
}
export interface Product {
  id?: number;
  name: string;
  price: number;
}
export interface SaleProduct {
  id?: string;
  productId: number;
  value: number;
  valueStr?: string;
  valueAmount: number;
  valueAmountStr?: string;
  amount: number;
  product: Product;
}
export interface Sale {
  id?: string;
  user?: User;
  products: Product[];
  productsSales: SaleProduct[];
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
  products: [],
  productsSales: []
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
