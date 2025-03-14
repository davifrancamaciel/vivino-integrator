export interface Company {
  id?: string;
  name?: string;
  groups?: string;
  image?: string;
  banner?: string;
  groupsFormatted: string[];
  createdAt?: string;
  updatedAt?: string;
  pixKey?: string;
  active: boolean;
  individualCommission: boolean;
  vivinoApiIntegrationActive: boolean;
  open: boolean;
}

export const initialStateForm: Company = {
  id: undefined,
  name: '',
  groups: '',
  groupsFormatted: [],
  createdAt: '',
  updatedAt: '',
  active: true,
  open: true,
  individualCommission: false,
  vivinoApiIntegrationActive: false
};

export interface Filter {
  id?: string;
  name?: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  id: '',
  name: '',
  pageNumber: 1,
  pageSize: 10
};
