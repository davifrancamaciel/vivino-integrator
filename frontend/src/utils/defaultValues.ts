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
  services: 'services'
};

export const apiRoutes = {
  groups: 'groups',
  users: appRoutes.users,
  products: appRoutes.products,
  settings: 'settings'
};

export const apiRoutesArray = [
  apiRoutes.users,
  apiRoutes.groups,
  apiRoutes.products,
  apiRoutes.settings
];

export const roules = {
  administrator: 'administrador',
  users: 'usuarios',
  products: 'produtos',
  services: 'serviços'
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
