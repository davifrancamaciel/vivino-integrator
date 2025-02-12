import { IOptions } from 'utils/commonInterfaces';
import { Company } from './../Company/interfaces';
export interface ShippingCompany {
  name: string;
}
export interface Romanian {
  id?: string;
  company?: Company;
  shippingCompany?: ShippingCompany;
  noteNumber?: string;
  noteValue?: string;
  clientName?: string;
  shippingCompanyId?: number;
  shippingValue?: string;
  trackingCode?: string;
  originSale?: string;
  saleDateAt?: string;
  volume?: string;
  formOfPayment?: string;
  createdAt?: string;
  updatedAt?: string;
  delivered: boolean;
  sended: boolean;
  companyId?: string;
  originCompanyId: string;
}

export const initialStateForm: Romanian = {
  id: undefined,
  noteNumber: '',
  noteValue: '',
  clientName: '',
  createdAt: '',
  updatedAt: '',
  delivered: false,
  sended: false,
  originCompanyId: '1'
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
  delivered?: string;
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

export const originCompanys: IOptions[] = [
  { value: '1', label: 'Ventura Vinhos' },
  { value: '2', label: 'AML Reis' },
  { value: '3', label: 'Rose Market' },
  { value: '4', label: 'Wine Brothers' },
  { value: '5', label: 'Videiras e Oliveiras ' },
  { value: '6', label: 'Millesime' },
  { value: '7', label: 'Ely' },
  { value: '8', label: 'Loja Itaipava' }
];
