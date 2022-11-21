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
  products: 'products',
  romanians: 'romanians',
  sales: 'sales'
};

export const apiRoutes = {
  dashboard: 'dashboard',
  groups: 'groups',
  users: appRoutes.users,
  products: appRoutes.products,
  romanians: appRoutes.romanians,
  sales: appRoutes.sales,
  companies: 'companies',
  shippingCompanies: 'shipping-companies'
};

export const apiRoutesArray = [
  apiRoutes.dashboard,
  apiRoutes.users,
  apiRoutes.groups,
  apiRoutes.products,
  apiRoutes.romanians,
  apiRoutes.sales,
  apiRoutes.companies,
  apiRoutes.shippingCompanies
];

export const roules = {
  administrator: 'administrador',
  users: 'usuarios',
  products: 'produtos',
  romanians: 'romaneios',
  sales: 'vendas',
  saleUserIdChange: 'vendedor_vendas'
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

export const particularUsers = {
  userIdTha: '623be749-c4d7-4987-bb3d-5bdd1d810223',
  userIdSa: '7eaed82d-72e2-40c6-9de9-117f324f5530',
  userIdRe: '089c0e53-ebd7-444f-a8ec-4856475ecef7'
};
