import { SaleProduct } from '../../interfaces';
export interface PropTypes {
  products: SaleProduct[];
  setProducts: (products: SaleProduct[]) => void;
}
