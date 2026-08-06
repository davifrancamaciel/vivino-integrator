import { Expense } from '../../interfaces';

export interface PropTypes {
  actionFilter: (type: string) => void;
  items: Expense[];
  print?: boolean;
  title: string;
}
