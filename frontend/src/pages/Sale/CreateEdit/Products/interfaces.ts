import { SaleProduct } from '../../interfaces';

export interface Product {
  id?: string;
  name?: string;
  value?: string;
}

export interface PropTypes {
  products: SaleProduct[];
  setProducts: (products: SaleProduct[]) => void;
}
