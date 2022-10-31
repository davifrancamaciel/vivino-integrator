export interface Sale {
  id?: string;
  product?: string;
  value?: number;
  note?: string;
  userId?: string;
  userName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const initialStateForm: Sale = {
  id: undefined,
  product: ''
};

export interface Filter {
  id?: string;
  product?: string;
  valueMin?: string;
  valueMax?: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  id: '',
  product: '',
  pageNumber: 1,
  pageSize: 10
};
