import { IOptions } from 'utils/commonInterfaces';

export interface Wine {
  id?: string;
  productName?: string;
  price?: string;
  quantityIsMinimum?: boolean;
  bottleSize?: string;
  bottleQuantity?: number;
  link?: string;
  inventoryCount?: number;
  producer?: string;
  wineName?: string;
  appellation?: string;
  vintage?: string;
  country?: string;
  color?: string;
  image?: string;
  ean?: string;
  description?: string;
  alcohol?: string;
  producerAddress?: string;
  importerAddress?: string;
  varietal?: string;
  ageing?: string;
  closure?: string;
  winemaker?: string;
  productionSize?: string;
  residualSugar?: string;
  acidity?: string;
  ph?: string;
  containsMilkAllergens?: boolean;
  containsEggAllergens?: boolean;
  nonAlcoholic?: boolean;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;
  skuVivino?: string;
}

export const initialStateForm: Wine = {
  id: undefined,
  productName: '',
  price: '',
  // bottleSize: '',
  bottleQuantity: 1,
  quantityIsMinimum: false,
  active: true,
  containsMilkAllergens: false,
  containsEggAllergens: false,
  nonAlcoholic: false,
  createdAt: '',
  updatedAt: ''
};

export interface Filter {
  id?: string;
  skuVivino?: string;
  productName: string;
  producer: string;
  wineName: string;
  priceMin?: string;
  priceMax?: string;
  pageNumber: number;
  pageSize: number;
}

export const initialStateFilter: Filter = {
  id: '',
  productName: '',
  producer: '',
  wineName: '',
  pageNumber: 1,
  pageSize: 10
};

export const booleanFilter: IOptions[] = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Sim' },
  { value: 'false', label: 'Não' }
];

const arrBottleSize = ['375 ml', '500 ml', '750 ml', '1000 ml', '1500 ml'];
export const bottleSizes: IOptions[] = arrBottleSize.map((x: string) => ({
  value: x,
  label: x
}));

const arrVintages = (): number[] => {
  const year = new Date().getFullYear();
  let array: number[] = [];
  for (let i = year; i > year - 200; i--) {
    array.push(i);
  }
  return array;
};
export const vintages: IOptions[] = arrVintages().map((x: number) => ({
  value: `${x}`,
  label: `${x}`
}));
