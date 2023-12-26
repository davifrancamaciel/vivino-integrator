export interface Filter {
  createdAtStart?: string;
  createdAtEnd?: string;
  pageSize: number;
  type: 'products' | 'wines'; 
}

export interface PropTypes {
  loading: boolean;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  action: (filter: Filter) => void;
}
