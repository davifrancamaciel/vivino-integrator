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
  place?: string;
  formOfPayment?: string;
  createdAt?: string;
  updatedAt?: string;
  delivered: boolean;
}

export const initialStateForm: Romanian = {
  id: undefined,
  noteNumber: '',
  noteValue: '',
  clientName: '',
  createdAt: '',
  updatedAt: '',
  delivered: false
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
