export interface Product {
  id?: string;
  name?: string;
  value?: number;
}

export interface PropTypes {
  products: Product[];
  setProducts: (products: Product[]) => void;
}
