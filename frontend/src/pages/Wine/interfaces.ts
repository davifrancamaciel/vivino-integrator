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
}

export const initialStateForm: Wine = {
  id: undefined,
  productName: '',
  price: '',
  bottleSize: '',
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
  productName: string;
  producer: string;
  wineName: string;
  priceMin?:string;
  priceMax?:string;
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
