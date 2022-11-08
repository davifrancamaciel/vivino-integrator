export interface Product {
  id?: string;
  name?: string;
  value?: string;
}

export interface PropTypes {
  products: Product[];
  setProducts: (products: Product[]) => void;
}
