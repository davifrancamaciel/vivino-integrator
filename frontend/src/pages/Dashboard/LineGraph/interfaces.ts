export interface PropTypes {
  label: string;
  type: 'products' | 'wines'; 
}

export interface Products {
  label: string;
  id: number;
  value: number;
  active: boolean;
  inventoryCount: number;
  price: string;
}
