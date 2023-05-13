export interface Company {
  id?: string;
  name?: string;
  groups?: string;
  groupsFormatted: string[];
  createdAt?: string;
  updatedAt?: string;
  active: boolean;
  vivinoApiIntegrationActive: boolean;
}

export const initialStateForm: Company = {
  id: undefined,
  name: '',
  groups: '',
  groupsFormatted: [],
  createdAt: '',
  updatedAt: '',
  active: true,
  vivinoApiIntegrationActive: false,
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
