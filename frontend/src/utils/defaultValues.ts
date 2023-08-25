import { IOptions } from './commonInterfaces';

export const systemColors = {
  GREEN: '#389e0d',
  YELLOW: '#ffa940',
  RED: '#e3262e',
  RED_DARK: '#ba1628',
  BLUE: '#0D6EFD',
  GREY: '#8c8c8c',
  ORANGE: '#FF4500',
  LIGHT_BLUE: '#2db7f5',
  LIGHT_PINK: '#FF9A9A',
  LIGHT_GREY: '#999999'
};

export const appRoutes = {
  users: 'users',
  clients: 'clients',
  products: 'products',
  wines: 'wines',
  romanians: 'romanians',
  sales: 'sales',
  expenses: 'expenses',
  companies: 'companies',
  services: 'services'
};

export const apiRoutes = {
  dashboard: 'dashboard',
  groups: 'groups',
  users: appRoutes.users,
  products: appRoutes.products,
  wines: appRoutes.wines,
  romanians: appRoutes.romanians,
  sales: appRoutes.sales,
  companies: appRoutes.companies,
  services: appRoutes.services,
  shippingCompanies: 'shipping-companies',
  expenses: 'expenses',
  expenseTypes: 'expense-types'
};

export const apiRoutesArray = [
  apiRoutes.dashboard,
  apiRoutes.users,
  apiRoutes.groups,
  apiRoutes.products,
  apiRoutes.wines,
  apiRoutes.romanians,
  apiRoutes.sales,
  apiRoutes.companies,
  apiRoutes.shippingCompanies,
  apiRoutes.expenseTypes,
  apiRoutes.expenses,
  apiRoutes.services
];

export const roules = {
  administrator: 'administrador',
  users: 'usuarios',
  products: 'produtos',
  wines: 'vinhos',
  romanians: 'romaneios',
  sales: 'vendas',
  saleUserIdChange: 'vendedor_vendas',
  expenses: 'despesas'
};

export const enumStatusUserAws = {
  FORCE_CHANGE_PASSWORD: 'FORCE_CHANGE_PASSWORD',
  NEW_PASSWORD_REQUIRED: 'NEW_PASSWORD_REQUIRED',
  CONFIRMED: 'CONFIRMED'
};

export const booleanFilter: IOptions[] = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Sim' },
  { value: 'false', label: 'Não' }
];

export const userType = {
  USER: 'USER',
  CLIENT: 'CLIENT'
};

export const pageItemsFilter: IOptions[] = [
  { value: '10', label: '10' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
  { value: '500', label: '500' },
  { value: '1000', label: '1.000' }
];
