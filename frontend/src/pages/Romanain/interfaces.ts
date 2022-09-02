export interface Company {
  name: string;
}
export interface Romanian {
  id?: string;
  company?: Company;
  noteNumber?: string;
  noteValue?: string;
  companyId?: number;
  clientName?: string;
  shippingCompanyName?: string;
  shippingValue?: string;
  trackingCode?: string;
  originSale?: string;
  saleDateAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const initialStateForm: Romanian = {
  id: undefined,
  noteNumber: '',
  noteValue: '',
  clientName: '',
  createdAt: '',
  updatedAt: ''
};

export interface Filter {
  id?: string;
  companyName?: string;
  noteNumber?: string;
  clientName?: string;
  shippingCompanyName?: string;
  originSale?: string;
  trackingCode?: string;
  saleDateAtStart?: string;
  saleDateAtEnd?: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  id: '',
  companyName: '',
  noteNumber: '',
  clientName: '',
  pageNumber: 1,
  pageSize: 10
};
