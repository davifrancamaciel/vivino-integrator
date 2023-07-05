export interface PropTypes {
  label: string;
  type: 'products' | 'wines';
}

export interface Products {
  name: string;
  id: number;
  total: number;
}
